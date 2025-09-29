# Peek-a-boo Project Development Context

This file is maintained by the AI assistant to provide context across development sessions.

## Project Overview

Peek-a-boo is a mobile application built with Ionic, React, and Capacitor. It uses Firebase for its backend services. The core feature is a chat application with rich media sharing and a synchronized "Watch Together" media playback functionality.

## Current Goals & Roadmap

1.  **Improve "Watch Together" Feature:** *(Addressed)* The synchronized media player logic has been updated for better reliability. Continuous time updates via `onProgress` have been removed. Instead, the playback position is now synchronized only during key events: play, pause, and seek.
2.  **Implement YouTube Watch Together:** *(In Progress)* The file upload feature has been shelved due to persistent native implementation issues. The current goal is to allow users to share YouTube links and watch them together with synchronized playback.

## Key Features

-   **Real-time Chat:** One-on-one conversations using Firestore.
-   **Media Sharing:** Users can share YouTube videos for synchronized playback. (File uploads are temporarily disabled).
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

## Session Changelog (as of 2025-09-29)

### Fixes for "Watch Together"

-   **File:** `peek-a-boo/src/components/WatchTogetherPlayer.tsx`
-   **Problem:** Users could not pause media, and seeking was not synchronized correctly. `onTimeUpdate` events were sending stale `isPlaying: true` state, overwriting pause commands.
-   **Solution:**
    1.  Switched from `set` to `update` for Realtime Database state changes. This prevents overwriting the entire state object with stale data and only updates the specified properties.
    2.  Removed the throttled `onProgress` handler to eliminate continuous, and sometimes conflicting, time updates.
    3.  The playback position (`progress`) is now explicitly synchronized along with the `isPlaying` state whenever a user plays or pauses the video.
    4.  The `onSeek` handler remains to synchronize manual seeking actions. This results in a more stable and event-driven synchronization logic.

### Fixes for Mobile File Uploads

-   **File:** `peek-a-boo/src/lib/firebase.ts`
-   **Problem:** File uploads failed on native mobile platforms during development.
-   **Status:** This feature has been temporarily shelved due to persistent, complex issues with native file system access, plugin reliability (`@capacitor-firebase/storage`), and emulator connectivity. The focus has pivoted to implementing YouTube link sharing and synchronized playback, which relies on more stable, web-based technologies.

## Session Context (as of 2025-09-29)

### "Watch Together" Bug Analysis

-   **Problem:** Neither user can pause the media once a "Watch Together" session is active.
-   **File:** `peek-a-boo/src/components/WatchTogetherPlayer.tsx`
-   **Triggering `updateRtdbState`:** The function is called on `onPlay`, `onPause`, and `onTimeUpdate` events of the media element.
-   **Hypothesis:** The `isUpdatingFromRemote` ref, intended to prevent infinite loops between clients, might be incorrectly blocking user-initiated pause events from being sent to the Realtime Database. The `onTimeUpdate` event continuously sends updates while playing, which might interfere with the `onPause` event handler logic.

### Mobile File Upload Failure Analysis

-   **Problem:** File uploads do not work on native mobile platforms (Android/iOS). The process was failing to return a valid URL, causing a Firestore `undefined` field value error.
-   **Files:** `peek-a-boo/src/pages/ChatPage.tsx`, `peek-a-boo/src/lib/firebase.ts`
-   **Implementation:** `ChatPage.tsx` uses `@capacitor-firebase/storage` for native uploads.
-   **Hypothesis & Solution History:** The file upload feature went through several iterations to resolve issues on native platforms.
    1.  **Initial Problem:** Uploads failed on native. This was due to missing native plugin configuration in `MainActivity.java` and `AndroidManifest.xml`.
    2.  **Capacitor Plugin Issues:** The `@capacitor-firebase/storage` plugin proved unreliable. It failed with `Uri` paths due to file access issues ("Object does not exist") and its `uploadString` method was not implemented on Android.
    3.  **DataUrl Memory/Type Limitation:** An attempt to use the Capacitor Camera plugin with `DataUrl` and the Firebase Web SDK's `uploadString` method solved the `Uri` issue but limited uploads to only images and was not memory-efficient for large files like videos.
    4.  **Emulator Connection Error:** A persistent `Firebase Storage: An unknown error occurred` was traced to the emulator connection setup. The fix attempt using a hardcoded IP (`10.0.2.2`) for Android was incorrect for the user's `--external` development workflow. The configuration has been reverted to use `window.location.hostname` which correctly provides the development server's IP. The native Firebase Storage plugin is also now configured to use the emulator for any potential future use.
    5.  **Final Solution (Hybrid Native/Web):**
        *   **Native Platform:**
            *   The `@capacitor/camera` plugin selects a media file and returns a temporary cache URI.
            *   To bypass Android file permission issues that cause "Object does not exist" errors, the `@capacitor/filesystem` plugin is used to copy the file from the temporary cache to a private app directory (`Directory.Data`).
            *   The reliable native `@capacitor-firebase/storage` plugin is then used to `uploadFile` using the new, accessible URI.
            *   The copied file is deleted after a successful upload.
        *   **Web Platform:**
            *   The `@capacitor/camera` plugin returns a `webPath`.
            *   This path is converted to a `Blob` using the `fetch` API.
            *   The memory-efficient `uploadBytes` function from the Firebase Web JS SDK is used to upload the `Blob`.
