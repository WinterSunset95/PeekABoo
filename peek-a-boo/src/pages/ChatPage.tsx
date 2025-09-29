import { RouteComponentProps } from "react-router";
import { useContext, useEffect, useRef, useState } from "react";
import {
  IonActionSheet,
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { UserContext } from "../App";
import "./ChatPage.css";
import { ChatMessage } from "../lib/models";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "../lib/firebase";
import { getStorage, ref as storageRef, uploadString, getDownloadURL } from "firebase/storage";
import { useUserData } from "../hooks/useUserData";
import ChatMessageItem from "../components/ChatMessageItem";
import { attachOutline, closeCircleOutline, sendOutline } from "ionicons/icons";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { FirebaseStorage } from '@capacitor-firebase/storage';
import { PlaybackState } from "../lib/models";
import { database } from "../lib/firebase";
import { ref, onValue, set, serverTimestamp as rtdbServerTimestamp, off } from "firebase/database";
import WatchTogetherPlayer from "../components/WatchTogetherPlayer";

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
  const [showToast] = useIonToast();
  const [activeWatchSession, setActiveWatchSession] = useState(false);
  const [showAttachSheet, setShowAttachSheet] = useState(false);
  const contentRef = useRef<HTMLIonContentElement>(null);

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
      setTimeout(() => contentRef.current?.scrollToBottom(300), 100);
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
    
    const messageData: Partial<ChatMessage> = {
      senderId: user.uid,
      text: newMessage,
      timestamp: serverTimestamp(),
      type: 'text',
    };
    
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
        resultType: CameraResultType.DataUrl,
        source,
      });

      const dataUrl = photo.dataUrl;
      if (!dataUrl) {
        throw new Error('No file data received');
      }

      setIsUploading(true);
      const fileName = new Date().getTime() + '.jpeg';
      const filePath = `chats/${convoId}/${fileName}`;
      let downloadURL: string;

      const storage = getStorage(app);
      const fileStorageRef = storageRef(storage, filePath);
      await uploadString(fileStorageRef, dataUrl, 'data_url');
      downloadURL = await getDownloadURL(fileStorageRef);
      
      await sendMediaMessage(downloadURL, 'image', fileName);

    } catch (e) {
      console.error('File upload error', e);
      if (e instanceof Error && e.message.includes('cancelled')) {
        // Do nothing, user cancelled
      } else {
        showToast({ message: 'File upload failed.', duration: 3000, color: 'danger' });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleStartWatchTogether = (mediaUrl: string, mediaType: 'video' | 'audio', title: string) => {
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
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          {userLoading ? <IonSpinner slot="start" /> : (
            <>
              <IonAvatar slot="start" className="chat-header-avatar">
                <img src={otherUser?.photoURL} alt={otherUser?.displayName} />
              </IonAvatar>
              <IonTitle>{otherUser?.displayName || 'Chat'}</IonTitle>
            </>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent ref={contentRef} className="ion-padding" scrollEvents={true}>
        {activeWatchSession && convoId && <WatchTogetherPlayer convoId={convoId} />}
        <div className="chat-messages-container">
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
        <IonActionSheet
          isOpen={showAttachSheet}
          onDidDismiss={() => setShowAttachSheet(false)}
          header="Attach Image"
          buttons={[
            {
              text: 'Take Photo',
              handler: () => selectAndUploadFile(CameraSource.Camera),
            },
            {
              text: 'Choose from Gallery',
              handler: () => selectAndUploadFile(CameraSource.Photos),
            },
            {
              text: 'Cancel',
              role: 'cancel',
            },
          ]}
        />
      </IonContent>
      <IonFooter>
        <IonToolbar className="chat-input-toolbar">
          <div className="chat-footer-wrapper">
            {replyingTo && (
              <div className="reply-preview-container">
                <div className="reply-preview-content">
                  <p className="reply-preview-sender">Replying to {replyingTo.senderId === user?.uid ? 'yourself' : otherUser?.displayName}</p>
                  <p className="reply-preview-text">{replyingTo.text}</p>
                </div>
                <IonButton fill="clear" onClick={() => setReplyingTo(null)} className="reply-preview-close">
                  <IonIcon icon={closeCircleOutline} />
                </IonButton>
              </div>
            )}
            <form className="chat-form" onSubmit={handleSendMessage}>
              <IonButton fill="clear" slot="start" onClick={() => setShowAttachSheet(true)} disabled={isUploading}>
                <IonIcon icon={attachOutline} />
              </IonButton>
              <IonInput
                value={newMessage}
                onIonChange={(e) => setNewMessage(e.detail.value!)}
                placeholder="Type a message..."
                className="chat-input"
                disabled={!convoId || isUploading}
              />
              <IonButton type="submit" fill="clear" slot="end" disabled={newMessage.trim() === '' || !convoId || isUploading}>
                {isUploading ? <IonSpinner name="crescent" /> : <IonIcon icon={sendOutline} />}
              </IonButton>
            </form>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default ChatPage;
