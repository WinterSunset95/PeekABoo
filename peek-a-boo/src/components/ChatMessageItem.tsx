import React from 'react';
import { IonAvatar, createGesture, IonImg, IonButton, IonIcon } from '@ionic/react';
import { ChatMessage } from '../lib/models';
import './ChatMessageItem.css';
import { useUserData } from '../hooks/useUserData';
import { playCircleOutline } from 'ionicons/icons';

interface ChatMessageItemProps {
  message: ChatMessage;
  currentUserId: string;
  onReply: (message: ChatMessage) => void;
  onStartWatchTogether: (mediaUrl: string, mediaType: 'video' | 'audio' | 'youtube', title: string) => void;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, currentUserId, onReply, onStartWatchTogether }) => {
  const isSender = message.senderId === currentUserId;
  const { userData, loading } = useUserData(isSender ? null : message.senderId);
  const itemRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!itemRef.current) return;

    const gesture = createGesture({
      el: itemRef.current,
      gestureName: 'swipe-to-reply',
      direction: 'x',
      onMove: (ev) => {
        // Only track right-swipes with a reasonable limit
        if (itemRef.current && ev.deltaX > 0) {
          itemRef.current.style.transform = `translateX(${Math.min(ev.deltaX, 150)}px)`;
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
            if (itemRef.current) itemRef.current.style.transition = '';
          }, 200);
        }
      },
    });

    gesture.enable(true);

    return () => {
      gesture.destroy();
    };
  }, [message, onReply]);

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
        <div className="chat-content">
          {message.type === 'image' && message.mediaUrl && (
            <IonImg src={message.mediaUrl} className="chat-media-image" />
          )}
          {(message.type === 'video' || message.type === 'audio' || message.type === 'youtube') && message.mediaUrl && (
            <div className="watch-together-container">
              {message.type === 'video' && <video src={message.mediaUrl} controls className="chat-media-video" />}
              {message.type === 'audio' && <audio src={message.mediaUrl} controls className="chat-media-audio" />}
              {message.type === 'youtube' && (
                <div className="youtube-link-preview">
                  <p className="chat-text">{message.text}</p>
                </div>
              )}
              <IonButton 
                fill="clear" 
                className="watch-together-button"
                onClick={() => onStartWatchTogether(message.mediaUrl!, message.type, message.text)}
              >
                <IonIcon icon={playCircleOutline} slot="start" />
                Watch Together
              </IonButton>
            </div>
          )}
          {message.type === 'text' && <p className="chat-text">{message.text}</p>}

          <span className="chat-timestamp">
            {message.timestamp ? new Date(
              message.timestamp.toMillis ? message.timestamp.toMillis() : message.timestamp
            ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageItem;
