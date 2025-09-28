import { RouteComponentProps } from "react-router";
import { useContext, useEffect, useRef, useState } from "react";
import {
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
import { useUserData } from "../hooks/useUserData";
import ChatMessageItem from "../components/ChatMessageItem";
import { sendOutline } from "ionicons/icons";

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
  const contentRef = useRef<HTMLIonContentElement>(null);

  useEffect(() => {
    if (!user || !chatId) return;
    const uids = [user.uid, chatId].sort();
    setConvoId(uids.join('-'));
  }, [chatId, user]);

  useEffect(() => {
    if (!convoId) return;

    const db = getFirestore(app);
    const messagesRef = collection(db, "chats", convoId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
      setMessages(msgs);
      setTimeout(() => contentRef.current?.scrollToBottom(300), 100);
    });

    return () => unsubscribe();
  }, [convoId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !user || !convoId) return;

    const db = getFirestore(app);
    const messagesRef = collection(db, "chats", convoId, "messages");

    await addDoc(messagesRef, {
      senderId: user.uid,
      text: newMessage,
      timestamp: serverTimestamp(),
      type: 'text',
    });

    setNewMessage("");
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
      <IonContent ref={contentRef} className="ion-padding">
        <div className="chat-messages-container">
          {messages.map((msg) => (
            <ChatMessageItem key={msg.id} message={msg} currentUserId={user!.uid} />
          ))}
        </div>
      </IonContent>
      <IonFooter>
        <IonToolbar className="chat-input-toolbar">
          <form className="chat-form" onSubmit={handleSendMessage}>
            <IonInput
              value={newMessage}
              onIonChange={(e) => setNewMessage(e.detail.value!)}
              placeholder="Type a message..."
              className="chat-input"
              disabled={!convoId}
            />
            <IonButton type="submit" fill="clear" slot="end" disabled={newMessage.trim() === '' || !convoId}>
              <IonIcon icon={sendOutline} />
            </IonButton>
          </form>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default ChatPage;
