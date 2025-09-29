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
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Paperclip, Send, X, Loader2 } from "lucide-react";

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
  const contentRef = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !convoId) return;

    const fileType = file.type.split('/')[0] as 'image' | 'video' | 'audio';
    if (!['image', 'video', 'audio'].includes(fileType)) {
      toast.error('Unsupported file type.');
      return;
    }

    setIsUploading(true);
    try {
      const storage = getStorage(app);
      const filePath = `chats/${convoId}/${Date.now()}-${file.name}`;
      const fileStorageRef = storageRef(storage, filePath);
      
      await uploadBytes(fileStorageRef, file);
      const downloadURL = await getDownloadURL(fileStorageRef);
      
      await sendMediaMessage(downloadURL, fileType, file.name);

    } catch (error) {
      console.error("File upload error", error);
      if (error instanceof Error) {
        toast.error(`Upload failed: ${error.message}`);
      } else {
        toast.error("An unknown upload error occurred.");
      }
    } finally {
      setIsUploading(false);
      // Reset file input to allow selecting the same file again
      if (e.target) {
        e.target.value = '';
      }
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
          <Button variant="ghost" size="icon" disabled={isUploading} onClick={() => fileInputRef.current?.click()}>
            <Paperclip className="h-6 w-6" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            hidden
            onChange={handleFileSelect}
            accept="image/*,video/*,audio/*"
          />

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
  );
};

export default ChatPage;
