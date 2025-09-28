# Peek-a-boo Project Development Context

This file is maintained by the AI assistant to provide context across development sessions.

## Project Overview

Peek-a-boo is a mobile application built with Ionic, React, and Capacitor. It uses Firebase for its backend services. The core feature is a chat application with rich media sharing and a synchronized "Watch Together" media playback functionality.

## Current Goals & Roadmap

1.  **Fix "Watch Together" Feature:** The immediate goal is to debug the synchronized media player. Currently, users are unable to pause the media once it starts playing.
2.  **Resolve Mobile File Uploads:** File uploads from mobile devices are failing. This needs investigation, likely focusing on the Capacitor and Firebase Storage integration.

## Key Features

-   **Real-time Chat:** One-on-one conversations using Firestore.
-   **Media Sharing:** Users can upload and share images, videos, and audio files, which are stored in Firebase Storage.
-   **Reply to Message:** A swipe-to-reply gesture allows quoting previous messages.
-   **Watch Together:** A synchronized media playback feature using Firebase Realtime Database to keep player states (play/pause, progress) in sync across participants.

## Tech Stack

-   **Frontend:** React, TypeScript, Ionic Framework
-   **Mobile Wrapper:** Capacitor
-   **Backend:** Firebase
    -   Authentication
    -   Firestore (for chat messages)
    -   Realtime Database (for "Watch Together" state)
    -   Storage (for media uploads)
    -   Functions (inferred)

## Conventions & Preferences

-   **AI Interaction:** The AI acts as an expert software developer, respecting existing conventions and limiting changes strictly to the user's request. All code modifications must be provided in `SEARCH/REPLACE` blocks.
-   **Code Style:** Follow existing patterns in the codebase. Components are functional with Hooks.

## Session Context (as of 2025-09-29)

### "Watch Together" Bug Analysis

-   **Problem:** Neither user can pause the media once a "Watch Together" session is active.
-   **File:** `peek-a-boo/src/components/WatchTogetherPlayer.tsx`
-   **Triggering `updateRtdbState`:** The function is called on `onPlay`, `onPause`, and `onTimeUpdate` events of the media element.
-   **Hypothesis:** The `isUpdatingFromRemote` ref, intended to prevent infinite loops between clients, might be incorrectly blocking user-initiated pause events from being sent to the Realtime Database. The `onTimeUpdate` event continuously sends updates while playing, which might interfere with the `onPause` event handler logic.

### Mobile File Upload Failure Analysis

-   **Problem:** File uploads do not work on native mobile platforms (Android/iOS).
-   **Files:** `peek-a-boo/src/pages/ChatPage.tsx`, `peek-a-boo/src/lib/firebase.ts`
-   **Implementation:** `ChatPage.tsx` uses the standard Firebase Web JS SDK (`firebase/storage`) for handling uploads.
-   **Hypothesis:** The `firebase.ts` configuration is missing the necessary setup for the native `@capacitor-firebase/storage` plugin. While other Firebase services like Auth and Firestore have specific `useEmulator` calls for Capacitor, Storage does not. This likely means native file access and upload are not correctly configured, causing uploads to fail on mobile despite working on the web.
