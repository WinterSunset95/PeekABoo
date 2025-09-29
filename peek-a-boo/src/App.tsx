import {
  IonApp,
  IonContent,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonSpinner,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  useIonAlert,
  useIonRouter,
} from '@ionic/react';
import React, { createContext, useEffect, useRef, useState } from 'react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import './App.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import { Redirect, Route, Switch } from 'react-router';
import { home, radio, search, settings, chatbubbleEllipsesOutline, personOutline, filmOutline } from 'ionicons/icons';
import { IonReactRouter } from '@ionic/react-router';
import { appVersion, Settings } from './lib/types';
import SettingsPage from './pages/Settings';
import HomePage from './pages/HomePage';
import Search from './pages/Search';
import MediaPage from './pages/MediaPage';
import InfoMode from './pages/Info/InfoMode';
import ChatPage from './pages/ChatPage';
import { getUpdates } from './lib/backendconnection';
import { getSettings } from './lib/storage';
import UserPage from './pages/UserPage'
import { app, auth } from "./lib/firebase"
import {
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import AuthComponent from './components/Auth';

setupIonicReact();

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
  const [showAlert, controls] = useIonAlert()

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

  return (
    <UserContext.Provider value={{ user, setUser, name }}>
    <IonApp>
      {loading ? (
        <IonPage>
          <IonContent fullscreen>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <IonSpinner />
            </div>
          </IonContent>
        </IonPage>
      ) : user ? (
        <IonReactRouter>
          <IonRouterOutlet>
            <Switch>
              <Route exact path="/user/:id" component={UserPage} />
              <Route exact path="/chat/:id" component={ChatPage}/>
              <Route exact path="/:type(movie|tv|anime)/:id" component={InfoMode}/>
              <Route path="/">
                <IonTabs>
                  <IonRouterOutlet>
                    <Redirect exact path="/" to="/home" />
                    <Route exact path="/home">
                      <HomePage />
                    </Route>
                    <Route exact path="/search">
                      <Search />
                    </Route>
                    <Route exact path="/media">
                      <MediaPage />
                    </Route>
                    <Route exact path="/settings">
                      <SettingsPage />
                    </Route>
                  </IonRouterOutlet>
                  <IonTabBar slot="bottom">
                    <IonTabButton tab="home" href="/home">
                      <IonIcon icon={chatbubbleEllipsesOutline} />
                      <IonLabel>Home</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="search" href="/search">
                      <IonIcon icon={search} />
                      <IonLabel>Search</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="media" href="/media">
                      <IonIcon icon={filmOutline} />
                      <IonLabel>Media</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="settings" href="/settings">
                      <IonIcon icon={personOutline} />
                      <IonLabel>Settings</IonLabel>
                    </IonTabButton>
                  </IonTabBar>
                </IonTabs>
              </Route>
            </Switch>
          </IonRouterOutlet>
        </IonReactRouter>
      ) : (
        <AuthComponent />
      )}
    </IonApp>
    </UserContext.Provider>
  )
}

export default App;
