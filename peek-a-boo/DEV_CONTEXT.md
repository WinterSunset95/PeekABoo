# Peek-a-boo Project Development Context

This file is maintained by the AI assistant to provide context across development sessions.

## Project Overview

Peek-a-boo is a mobile application built with Ionic, React, and Capacitor. It uses Firebase for its backend services. The core feature is a chat application with rich media sharing and a synchronized "Watch Together" media playback functionality.

## Current Goals & Roadmap

1.  **Fix "Watch Together" Feature:** *(Addressed)* The synchronized media player logic was updated to fix a bug where users could not pause playback. The fix prevents race conditions and throttles time updates.
2.  **Resolve Mobile File Uploads & Add Media Support:** *(Addressed)* The file upload system has been refactored to support various media types (image, video, audio) and to fix connection issues with the Firebase Storage emulator on native devices.

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

## Session Changelog (as of 2025-09-29)

### Fixes for "Watch Together"

-   **File:** `peek-a-boo/src/components/WatchTogetherPlayer.tsx`
-   **Problem:** Users could not pause media. `onTimeUpdate` events were sending stale `isPlaying: true` state, overwriting pause commands.
-   **Solution:**
    1.  Switched from `set` to `update` for Realtime Database state changes. This prevents overwriting the entire state object with stale data and only updates the specified properties (`progress` or `isPlaying`).
    2.  Throttled `onTimeUpdate` events to fire at most once per second to reduce network traffic and prevent race conditions.

### Fixes for Mobile File Uploads

-   **File:** `peek-a-boo/src/lib/firebase.ts`
-   **Problem:** File uploads failed on native mobile platforms during development.
-   **Solution:**
    1.  Added the missing `@capacitor-firebase/storage` plugin configuration.
    2.  The native storage plugin is now configured to use the local Firebase Storage emulator, consistent with other Firebase services like Auth and Firestore. This requires installing the `@capacitor-firebase/storage` package.
    3.  Corrected the parameters for `FirebaseStorage.uploadFile` to use `path` for the remote storage destination and `uri` for the local file source URI, as per the plugin's documentation.
    4.  Modified the native upload logic to first `uploadFile` and then explicitly call `getDownloadUrl` to retrieve the URL, as the upload function itself does not return it.
    5.  Switched from `CameraResultType.Uri` to `CameraResultType.DataUrl` to work with image data directly.
    6.  The native `@capacitor-firebase/storage` plugin was found to not implement `uploadString` and its `uploadFile` method failed with `Uri`s. The solution was to remove the native plugin's usage for uploads and use the Firebase Web JS SDK's `uploadString` method on all platforms (web and native). This provides a reliable and unified upload mechanism.

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
    5.  **Final Solution:**
        *   The Capacitor Camera and native Firebase Storage plugins were removed from the upload process.
        *   A standard hidden `<input type="file">` is now used to allow users to select any media file (image, video, audio).
        *   The more memory-efficient `uploadBytes` function from the Firebase Web JS SDK is used to upload the selected `File` object directly. This solution works reliably across both web and native platforms.
