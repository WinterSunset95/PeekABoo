import {
  IonApp,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  useIonAlert,
} from '@ionic/react';
import React, { createContext, useEffect, useRef, useState } from 'react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

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
import { home, radio, search, settings } from 'ionicons/icons';
import { IonReactRouter } from '@ionic/react-router';
import { socket } from './lib/socket';
import { appVersion, Settings } from './lib/types';
import SettingsPage from './pages/Settings';
import HomePage from './pages/HomePage';
import Search from './pages/Search';
import Rooms from './pages/Rooms';
import MovieInfoPage from './pages/Info/MovieInfo';
import TvInfoPage from './pages/Info/TvInfo';
import InfoMode from './pages/Info/InfoMode';
import RoomMode from './pages/Info/RoomMode';
import ChatMode from './pages/Info/ChatMode';
import AuthPage from './pages/AuthPage';
import { getUpdates } from './lib/backendconnection';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { getSettings } from './lib/storage';
import { FileOpener } from '@capacitor-community/file-opener';
import { StatusBar } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { app, auth } from "./lib/firebase"
import { getApp } from 'firebase/app';
import {
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
  User
} from 'firebase/auth';

const getFirebaseAuth = async () => {
  if (Capacitor.isNativePlatform()) {
    return initializeAuth(app, {
      persistence: indexedDBLocalPersistence,
    });
  } else {
    return getAuth(app)
  }
}

setupIonicReact();

export const UserContext = createContext<{
	user: User | null,
	setUser: React.Dispatch<React.SetStateAction<User | null>> | undefined,
	name: React.MutableRefObject<string>
} | undefined>(undefined)

const App: React.FC = () => {
	const name = useRef<string>("")
	const [user, setUser] = useState<User | null>(null)
	const [showAlert, controls] = useIonAlert()

	if (Capacitor.getPlatform() != 'web') {
		StatusBar.setOverlaysWebView({ overlay: false })
	}

	const checkPermissions = async () => {
		const res = await Filesystem.checkPermissions()
		if (res.publicStorage != 'granted') {
			const data = await Filesystem.requestPermissions()
			if (data.publicStorage != 'granted') {
				showAlert("Storage permissions are necessary for automatic updates and file downloads!!")
			}
		}
	}

	const loadUpdates = async () => {
		const res = await getUpdates()
		if (appVersion != res.latest.Version) {
			showAlert({
				header: `A new version (${res.latest.Version}) is available`,
				message: `
				ChangeLogs: \n\n
				${res.latest.ChangeLogs}
				`,
				buttons: [
					{
						text: 'Ignore',
						role: 'cancel',
						handler: () => {
							console.log("Cancelled")
						}
					},
					{
						text: 'Update',
						role: 'accept',
						handler: () => {
							downloadUpdate(res.latest.Apk)
						}
					}
				]
			})
		}
	}

	const downloadUpdate = async (filepath: string) => {
		const filenameArray = filepath.split("/")
		const filename = filenameArray[filenameArray.length-1]
		let url = ""
		const { boo } = await getSettings()
		if (filepath.includes("http")) {
			url = filepath
		} else {
			url = `${boo.Server}${filepath}`
		}
		console.log(filename)
		const res = await Filesystem.downloadFile({
			method: 'GET',
			url: url,
			directory: Directory.ExternalStorage,
			path: `Download/${filename}`
		})
		if (res.path) {
			showAlert({
				header: "Download successful!",
				message: `File was successfully downloaded to: ${res.path}. Install now?`,
				buttons: [
					{
						text: 'Later',
						role: 'cancel',
						handler: () => {
							console.log("Will install later")
						}
					},
					{
						text: 'Install',
						role: 'accept',
						handler: async () => {
							try {
								await FileOpener.open({
									filePath: res.path as string
								})
							} catch (e) {
								console.log(e)
							}
						}
					},
				]
			})
		} else {
			showAlert("Failed to download file")
		}
	}

	useEffect(() => {
		document.title = "PeekABoo"

		socket.on("connect", () => {
			if (!socket.id) return
			console.log(`Connected as: ${socket.id}`)
			socket.emit("addUser", {
				UserId: socket.id,
				UserName: name.current,
				UserImage: "https://avatar.iran.liara.run/username?username=" + name.current
			}, (returnedUser: User) => {
				setUser(returnedUser)
			})
		})

		checkPermissions()
		loadUpdates()
    setUser(auth.currentUser)
    console.log("Normal auth: ", auth.currentUser)

		return () => {
			socket.off("connect")
		}
	}, [])

	return (
		<UserContext.Provider value={{ user, setUser, name }}>
		<IonApp>
			<IonReactRouter>
				<IonRouterOutlet>
          {auth.currentUser === null ? (
            <AuthPage />
          ) : (
					<Switch>
						<Route exact path="/chat/:id" component={ChatMode}/>
						<Route exact path="/:type/:id" component={InfoMode}/>
						<Route exact path="/room/:type/:id" component={RoomMode}/>
						<Route exact path="/login" component={AuthPage}/>
						<IonTabs>
							<IonRouterOutlet>
								<Redirect exact path='/' to="/home" />
								<Route exact path="/home">
									<HomePage />
								</Route>
								<Route exact path="/search">
									<Search />
								</Route>
								<Route exact path="/rooms">
									<Rooms />
								</Route>
								<Route exact path="/settings">
									<SettingsPage />
								</Route>
							</IonRouterOutlet>

							<IonTabBar slot='bottom'>

								<IonTabButton tab='home' href='/home'>
									<IonIcon icon={home}></IonIcon>
									<IonLabel>Home</IonLabel>
								</IonTabButton>
								<IonTabButton tab='search' href='/search'>
									<IonIcon icon={search}></IonIcon>
									<IonLabel>Search</IonLabel>
								</IonTabButton>
								<IonTabButton tab='rooms' href='/rooms'>
									<IonIcon icon={radio}></IonIcon>
									<IonLabel>Room</IonLabel>
								</IonTabButton>
								<IonTabButton tab='settings' href='/settings'>
									<IonIcon icon={settings}></IonIcon>
									<IonLabel>Settings</IonLabel>
								</IonTabButton>

							</IonTabBar>
						</IonTabs>
					</Switch>
          )}
				</IonRouterOutlet>
			</IonReactRouter>
		</IonApp>
		</UserContext.Provider>
	)
}

export default App;
