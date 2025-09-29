import React, { createContext, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

/* Theme variables */
import SettingsPage from './pages/Settings';
import HomePage from './pages/HomePage';
import Search from './pages/Search';
import MediaPage from './pages/MediaPage';
import InfoMode from './pages/Info/InfoMode';
import ChatPage from './pages/ChatPage';
import UserPage from './pages/UserPage'
import { app, auth } from "./lib/firebase"
import { onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import AuthComponent from './components/Auth';
import MainLayout from './components/MainLayout';
import { Loader2 } from 'lucide-react';
import { useTheme } from './hooks/useTheme';

export const UserContext = createContext<{
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  name: React.MutableRefObject<string>
}>({
  user: null,
  setUser: () => {},
  name: { current: '' },
})

function App() {
  const name = useRef<string>("")
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useTheme();

  useEffect(() => {
    document.title = "PeekABoo"

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check for user document and create if it doesn't exist
        const db = getFirestore(app);
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
          const newUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: user.metadata.creationTime,
          };
          await setDoc(userDocRef, newUser);
        }
      }
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [])

  const AppRoutes = () => (
    <Routes>
      <Route path="/user/:id" element={<UserPage />} />
      <Route path="/chat/:id" element={<ChatPage />} />
      <Route path="/:type/:id" element={<InfoMode />} />
      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );

  return (
    <UserContext.Provider value={{ user, setUser, name }}>
      <BrowserRouter>
        {loading ? (
          <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : user ? (
          <AppRoutes />
        ) : (
          <AuthComponent />
        )}
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App;
