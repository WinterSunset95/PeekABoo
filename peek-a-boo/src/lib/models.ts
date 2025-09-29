import { Timestamp } from "firebase/firestore";

// /users/{userId}
export interface UserData {
  uid: string,
  displayName: string,
  email: string,
  photoURL: string,
  createdAt: string
}

// /users/{userId}/friends/{friendId}
export interface Friend {
  uid: string,
  status: "sent_pending" | "received_pending" | "friends",
  since: number
}

// /users/{userId}/blocked/{blockedUserId}
export interface BlockedUser {
  uid: string,
  blockedAt: number
}

// /users/{userId}/favourites/{favouriteMediaId}
export interface Favourite {
  mediaId: string,
  mediaType: "movie" | "show" | "anime" | "song" | "gif" | "photo",
  title: string,
  posterUrl: string,
  addedAt: number
}

// /users/{userId}/uploads/{uploadId}
export interface Upload {
  storagePath: string,
  fileName: string,
  mediaType: "video" | "audio" | "gif" | "photo" | "unknown",
  title: string,
  uploadedAt: number
}

// /chats/{chatId}
export interface Chat {
  id: string,
  participants: string[], // array of user uids
  lastMessage?: ChatMessage
}

// /chats/{chatId}/messages/{messageId}
export interface ReplyContext {
  messageId: string;
  senderId: string;
  senderName: string;
  text: string;
}

export interface ChatMessage {
  id: string,
  senderId: string,
  text: string,
  timestamp: Timestamp | number | null,
  type: "text" | "image" | "video" | "audio" | "youtube", // extendable
  mediaUrl?: string,
  replyContext?: ReplyContext
}

// RTDB model for /playback_sessions/{chatId}
export interface PlaybackState {
  mediaUrl: string;
  mediaType: 'video' | 'audio' | 'youtube';
  title: string;
  isPlaying: boolean;
  progress: number;
  lastUpdatedBy: string; // uid of the user who last changed the state
  timestamp: object; // server timestamp
}

