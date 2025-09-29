import React, { createContext, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

/* Theme variables */
import './theme/variables.css';
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

export const UserContext = createContext<{
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  name: React.MutableRefObject<string>
}>({
  user: null,
  setUser: () => {},
  name: { current: '' },
})

const App: React.FC = () => {
  const name = useRef<string>("")
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

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
      <Route path="/home" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/search" element={<MainLayout><Search /></MainLayout>} />
      <Route path="/media" element={<MainLayout><MediaPage /></MainLayout>} />
      <Route path="/settings" element={<MainLayout><SettingsPage /></MainLayout>} />
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/user/:id" element={<UserPage />} />
      <Route path="/chat/:id" element={<ChatPage />} />
      <Route path="/:type(movie|tv|anime)/:id" element={<InfoMode />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
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
