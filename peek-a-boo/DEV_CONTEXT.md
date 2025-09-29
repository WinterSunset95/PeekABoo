# Peek-a-boo Project Development Context

This file is maintained by the AI assistant to provide context across development sessions.

## Project Overview

Peek-a-boo is a web application built with React, Vite, Tailwind CSS, and Shadcn UI. It uses Firebase for its backend services. The core feature is a chat application with rich media sharing and a synchronized "Watch Together" media playback functionality. The project was recently migrated from an Ionic/Capacitor-based hybrid mobile app to a web-only focus.

## Current Goals & Roadmap

1.  **Complete Web Migration:** *(Addressed)* The application has been fully migrated from an Ionic/Capacitor stack to a modern web stack (React, Vite, Tailwind, Shadcn UI). All native dependencies have been removed.
2.  **UI Enhancements:** *(In Progress)* Polish the new UI, including adding blur effects to headers and navigation areas and improving active state highlighting for navigation elements.

## Key Features

-   **Real-time Chat:** One-on-one conversations using Firestore.
-   **Media Sharing:** Users can share YouTube videos for synchronized playback and upload their own photos/videos.
-   **Reply to Message:** A hover-to-reveal reply button allows quoting previous messages.
-   **Watch Together:** A synchronized media playback feature using Firebase Realtime Database to keep player states (play/pause, progress) in sync across participants.

## Tech Stack

-   **Frontend:** React, TypeScript, Vite, Tailwind CSS, Shadcn UI
-   **Routing:** React Router DOM
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

### Migration from Ionic/Capacitor to Web Stack

-   **Files:** Project-wide.
-   **Problem:** Ionic dependencies were causing `react-router-dom` version conflicts and limiting the project to a hybrid-app feel. The goal shifted to a pure web application.
-   **Solution:**
    1.  **Component Refactoring:** Systematically refactored all components and pages (`Auth`, `Card`, `ChatPage`, `HomePage`, `SettingsPage`, etc.) to remove Ionic UI components (`IonPage`, `IonButton`, `IonInput`, etc.) and replace them with a combination of standard HTML elements, Tailwind CSS for styling, and Shadcn UI components (`Button`, `Card`, `Avatar`, `Input`, etc.).
    2.  **Routing Migration:** Replaced `@ionic/react-router` with `react-router-dom`, converting all navigation logic to use `Link` and `useNavigate`. Implemented a declarative routing structure in `App.tsx` with a `MainLayout` for shared UI.
    3.  **Plugin & Hook Replacement:** Replaced Capacitor plugins (`Preferences`, `Camera`) and Ionic hooks (`useIonAlert`, `useIonToast`) with web-native equivalents (`localStorage`, `<input type="file">`, `sonner` toasts).
    4.  **Dependency Cleanup:** Removed all `@ionic/*` and `@capacitor/*` packages from `package.json`, deleted native `android`/`ios` directories, and removed framework-specific configuration files (`ionic.config.json`, `capacitor.config.ts`).

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
-   **Status:** This feature has been restored using the hybrid native/web solution detailed below. This approach leverages Capacitor for native file access and the Firebase SDK for the upload process to address previous reliability issues.

## Session Context (as of 2025-09-29)

### "Watch Together" Bug Analysis

-   **Problem:** Neither user can pause the media once a "Watch Together" session is active.
-   **File:** `peek-a-boo/src/components/WatchTogetherPlayer.tsx`
-   **Triggering `updateRtdbState`:** The function is called on `onPlay`, `onPause`, and `onTimeUpdate` events of the media element.
-   **Hypothesis:** The `isUpdatingFromRemote` ref, intended to prevent infinite loops between clients, might be incorrectly blocking user-initiated pause events from being sent to the Realtime Database. The `onTimeUpdate` event continuously sends updates while playing, which might interfere with the `onPause` event handler logic.

### Mobile File Upload Failure Analysis (Historical)

-   **Problem:** *This section documents the historical challenges with native file uploads before the project was migrated to a web-only stack.* File uploads failed on native mobile platforms.
-   **Files:** (Formerly) `peek-a-boo/src/pages/ChatPage.tsx`, `peek-a-boo/src/lib/firebase.ts`
-   **Implementation:** (Formerly) `ChatPage.tsx` used various Capacitor plugins.
-   **Hypothesis & Solution History:** The native file upload feature went through several iterations to resolve issues on native platforms, facing challenges with plugin reliability, file URI permissions, and emulator connections. Ultimately, this complexity contributed to the decision to pivot to a web-only application, where file uploads are handled reliably via the standard `<input type="file">` element and the Firebase Web SDK.
