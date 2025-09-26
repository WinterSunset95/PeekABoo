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
  status: "pending" | "friend",
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

