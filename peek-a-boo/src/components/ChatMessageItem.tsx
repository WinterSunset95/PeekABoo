import React from 'react';
import { ChatMessage } from '../lib/models';
import { useUserData } from '../hooks/useUserData';
import { PlayCircle, Reply } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '../lib/utils';

interface ChatMessageItemProps {
  message: ChatMessage;
  currentUserId: string;
  onReply: (message: ChatMessage) => void;
  onStartWatchTogether: (mediaUrl: string, mediaType: 'video' | 'audio' | 'youtube', title: string) => void;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, currentUserId, onReply, onStartWatchTogether }) => {
  const isSender = message.senderId === currentUserId;
  const { userData, loading } = useUserData(isSender ? null : message.senderId);

  return (
    <div className={cn("group flex items-end gap-2 p-2", isSender ? "justify-end" : "justify-start")}>
      {!isSender && !loading && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={userData?.photoURL} alt={userData?.displayName} />
          <AvatarFallback>{userData?.displayName?.[0]}</AvatarFallback>
        </Avatar>
      )}

      {!isSender && (
        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onReply(message)}>
          <Reply className="h-4 w-4" />
        </Button>
      )}

      <div className={cn(
        "relative max-w-xs md:max-w-md rounded-lg px-3 py-2",
        isSender ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        {message.replyContext && (
          <div className="border-l-2 border-primary pl-2 mb-1 opacity-80">
            <p className="text-xs font-bold">{message.replyContext.senderName}</p>
            <p className="text-xs truncate">{message.replyContext.text}</p>
          </div>
        )}

        {message.type === 'image' && message.mediaUrl && (
          <img src={message.mediaUrl} className="rounded-lg max-w-full" alt="Shared media" />
        )}
        
        {(message.type === 'video' || message.type === 'audio' || message.type === 'youtube') && message.mediaUrl && (
          <div className="relative">
            {message.type === 'video' && <video src={message.mediaUrl} controls className="rounded-lg w-full" />}
            {message.type === 'audio' && <audio src={message.mediaUrl} controls className="w-full" />}
            {message.type === 'youtube' && (
              <div className="p-2 bg-black/20 rounded-md">
                <p className="break-words">{message.text}</p>
              </div>
            )}
            <Button
              variant="secondary"
              className="absolute bottom-2 left-2 h-8"
              onClick={() => onStartWatchTogether(message.mediaUrl!, message.type, message.text)}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Watch Together
            </Button>
          </div>
        )}
        
        {message.type === 'text' && <p className="break-words">{message.text}</p>}

        <span className="text-xs opacity-70 float-right mt-1 ml-2">
          {message.timestamp ? new Date(
            message.timestamp.toMillis ? message.timestamp.toMillis() : message.timestamp
          ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </span>
      </div>

      {isSender && (
        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onReply(message)}>
          <Reply className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ChatMessageItem;
