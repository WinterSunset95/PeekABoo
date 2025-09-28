import React from 'react';
import { IonAvatar } from '@ionic/react';
import { ChatMessage } from '../lib/models';
import './ChatMessageItem.css';
import { useUserData } from '../hooks/useUserData';

interface ChatMessageItemProps {
  message: ChatMessage;
  currentUserId: string;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, currentUserId }) => {
  const isSender = message.senderId === currentUserId;
  const { userData, loading } = useUserData(isSender ? null : message.senderId);

  return (
    <div className={`chat-message-wrapper ${isSender ? 'sent' : 'received'}`}>
      {!isSender && !loading && (
        <IonAvatar className="chat-avatar">
          <img src={userData?.photoURL} alt={userData?.displayName} />
        </IonAvatar>
      )}
      <div className={`chat-bubble ${isSender ? 'sent' : 'received'}`}>
        <p className="chat-text">{message.text}</p>
        <p className="chat-timestamp">
          {message.timestamp ? new Date(
            message.timestamp.toMillis ? message.timestamp.toMillis() : message.timestamp
          ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </p>
      </div>
    </div>
  );
};

export default ChatMessageItem;
