import { IonPage } from "@ionic/react";

import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import { ChatMessage, PlaybackState } from "../lib/models";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { app, database } from "../lib/firebase";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref, onValue, set, serverTimestamp as rtdbServerTimestamp, off } from "firebase/database";
import { useUserData } from "../hooks/useUserData";
import ChatMessageItem from "../components/ChatMessageItem";
import WatchTogetherPlayer from "../components/WatchTogetherPlayer";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, Paperclip, Send, X, Loader2, Camera as CameraIcon, Image as ImageIcon } from "lucide-react";

interface ChatProps extends RouteComponentProps<{
  id: string; // This will be the chat ID
}> {}

const ChatPage: React.FC<ChatProps> = ({ match }) => {
  const { user } = useContext(UserContext);
  const chatId = match.params.id;
  
  const { userData: otherUser, loading: userLoading } = useUserData(chatId);
  const [convoId, setConvoId] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeWatchSession, setActiveWatchSession] = useState(false);
  const [showAttachSheet, setShowAttachSheet] = useState(false);
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!user || !chatId) return;
    const uids = [user.uid, chatId].sort();
    setConvoId(uids.join('-'));
  }, [chatId, user]);

  useEffect(() => {
    if (!convoId) return;

    // Listen for watch session
    const sessionRef = ref(database, `playback_sessions/${convoId}`);
    const sessionListener = onValue(sessionRef, (snapshot) => {
      setActiveWatchSession(snapshot.exists());
    });

    const db = getFirestore(app);
    const messagesRef = collection(db, "chats", convoId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
      setMessages(msgs);
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
      }, 100);
    });

    return () => {
      unsubscribe();
      off(sessionRef, 'value', sessionListener);
    }
  }, [convoId]);

  const sendTextMessage = async () => {
    if (newMessage.trim() === "" || !user || !convoId) return;
    
    const db = getFirestore(app);
    const messagesRef = collection(db, "chats", convoId, "messages");
    
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const youtubeMatch = newMessage.match(youtubeRegex);

    let messageData: Partial<ChatMessage>;

    if (youtubeMatch) {
      messageData = {
        senderId: user.uid,
        text: newMessage,
        timestamp: serverTimestamp(),
        type: 'youtube',
        mediaUrl: newMessage,
      };
    } else {
      messageData = {
        senderId: user.uid,
        text: newMessage,
        timestamp: serverTimestamp(),
        type: 'text',
      };
    }
    
    if (replyingTo) {
      messageData.replyContext = {
        messageId: replyingTo.id,
        senderId: replyingTo.senderId,
        senderName: replyingTo.senderId === user.uid ? 'You' : otherUser?.displayName || 'User',
        text: replyingTo.text.length > 100 ? `${replyingTo.text.substring(0, 97)}...` : replyingTo.text
      };
    }
    
    await addDoc(messagesRef, messageData);
  }

  const sendMediaMessage = async (url: string, type: 'image' | 'video' | 'audio', fileName: string) => {
    if (!user || !convoId) return;

    const db = getFirestore(app);
    const messagesRef = collection(db, "chats", convoId, "messages");

    await addDoc(messagesRef, {
      senderId: user.uid,
      text: fileName,
      timestamp: serverTimestamp(),
      type: type,
      mediaUrl: url,
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendTextMessage();
    setNewMessage("");
    setReplyingTo(null);
  };

  const selectAndUploadFile = async (source: CameraSource) => {
    if (!user || !convoId) return;

    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source,
      });

      const path = photo.path ?? photo.webPath;
      if (!path) {
        throw new Error("No file path available for upload.");
      }
      
      setIsUploading(true);
      const fileExtension = photo.format;
      const fileName = `${new Date().getTime()}.${fileExtension}`;
      const filePath = `chats/${convoId}/${fileName}`;
      let downloadURL: string;

      // Web implementation
      const response = await fetch(path);
      const blob = await response.blob();
      const storage = getStorage(app);
      const fileStorageRef = storageRef(storage, filePath);
      await uploadBytes(fileStorageRef, blob);
      downloadURL = await getDownloadURL(fileStorageRef);
      
      // The camera plugin only provides 'image' or 'video'
      const mediaType = photo.format === 'mp4' ? 'video' : 'image';
      await sendMediaMessage(downloadURL, mediaType, fileName);

    } catch (e) {
      console.error('File upload error', e);
      if (e instanceof Error && e.message.includes('cancelled')) {
        // User cancelled, do nothing.
      } else {
        toast.error('File upload failed.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartWatchTogether = (mediaUrl: string, mediaType: 'video' | 'audio' | 'youtube', title: string) => {
    if (!user || !convoId) return;

    const sessionRef = ref(database, `playback_sessions/${convoId}`);
    const initialState: PlaybackState = {
      mediaUrl,
      mediaType,
      title,
      isPlaying: false,
      progress: 0,
      lastUpdatedBy: user.uid,
      timestamp: rtdbServerTimestamp(),
    };
    set(sessionRef, initialState);
  };

  return (
    <IonPage>
    <div className="flex flex-col h-[100dvh] bg-background text-foreground">
      <header className="flex items-center p-2 border-b border-border shadow-sm">
        <Link to="/home">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        {userLoading ? <Loader2 className="animate-spin ml-2" /> : (
          <>
            <Avatar className="h-9 w-9 ml-2">
              <AvatarImage src={otherUser?.photoURL} alt={otherUser?.displayName} />
              <AvatarFallback>{otherUser?.displayName?.[0]}</AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold ml-3">{otherUser?.displayName || 'Chat'}</h2>
          </>
        )}
      </header>
      <main ref={contentRef} className="flex-grow overflow-y-auto p-4 space-y-4">
        {activeWatchSession && convoId && <WatchTogetherPlayer convoId={convoId} />}
        <div>
          {messages.map((msg) => (
            <ChatMessageItem 
              key={msg.id} 
              message={msg} 
              currentUserId={user!.uid} 
              onReply={setReplyingTo}
              onStartWatchTogether={handleStartWatchTogether}
            />
          ))}
        </div>
      </main>
      <footer className="p-2 border-t border-border">
        {replyingTo && (
          <div className="flex items-center justify-between bg-muted p-2 rounded-t-lg">
            <div className="text-sm border-l-2 border-primary pl-2">
              <p className="font-bold">Replying to {replyingTo.senderId === user?.uid ? 'yourself' : otherUser?.displayName}</p>
              <p className="truncate">{replyingTo.text}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setReplyingTo(null)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
        <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
          <Sheet open={showAttachSheet} onOpenChange={setShowAttachSheet}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isUploading}>
                <Paperclip className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Attach Media</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <Button variant="outline" className="justify-start gap-2" onClick={() => { selectAndUploadFile(CameraSource.Camera); setShowAttachSheet(false); }}>
                  <CameraIcon className="h-5 w-5" />
                  Take Photo/Video
                </Button>
                <Button variant="outline" className="justify-start gap-2" onClick={() => { selectAndUploadFile(CameraSource.Photos); setShowAttachSheet(false); }}>
                  <ImageIcon className="h-5 w-5" />
                  Choose from Gallery
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow"
            disabled={!convoId || isUploading}
          />
          <Button type="submit" size="icon" disabled={newMessage.trim() === '' || !convoId || isUploading}>
            {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </footer>
    </div>
    </IonPage>
  );
};

export default ChatPage;
