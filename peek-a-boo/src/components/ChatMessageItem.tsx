import React from 'react';
import { IonAvatar, useIonGesture } from '@ionic/react';
import { ChatMessage } from '../lib/models';
import './ChatMessageItem.css';
import { useUserData } from '../hooks/useUserData';

interface ChatMessageItemProps {
  message: ChatMessage;
  currentUserId: string;
  onReply: (message: ChatMessage) => void;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, currentUserId, onReply }) => {
  const isSender = message.senderId === currentUserId;
  const { userData, loading } = useUserData(isSender ? null : message.senderId);
  const itemRef = React.useRef<HTMLDivElement>(null);

  const gesture = useIonGesture(itemRef, {
    gestureName: 'swipe-to-reply',
    direction: 'x',
    onMove: (ev) => {
      if (itemRef.current && ev.deltaX > 0) { // Only track right-swipes
        itemRef.current.style.transform = `translateX(${ev.deltaX}px)`;
      }
    },
    onEnd: (ev) => {
      if (itemRef.current) {
        itemRef.current.style.transition = 'transform 0.2s ease-out';
        if (ev.deltaX > 80) { // Threshold met
          onReply(message);
        }
        // Reset position
        itemRef.current.style.transform = 'translateX(0px)';
        setTimeout(() => {
          if(itemRef.current) itemRef.current.style.transition = '';
        }, 200)
      }
    },
  });

  React.useEffect(() => {
    gesture.enable(true);
  }, []);

  return (
    <div ref={itemRef} className={`chat-message-wrapper ${isSender ? 'sent' : 'received'}`}>
      {!isSender && !loading && (
        <IonAvatar className="chat-avatar">
          <img src={userData?.photoURL} alt={userData?.displayName} />
        </IonAvatar>
      )}
      <div className={`chat-bubble ${isSender ? 'sent' : 'received'}`}>
        {message.replyContext && (
          <div className="reply-context">
            <p className="reply-sender">{message.replyContext.senderName}</p>
            <p className="reply-text">{message.replyContext.text}</p>
          </div>
        )}
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
