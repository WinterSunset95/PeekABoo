import {
  IonApp,
  IonButton,
  IonIcon,
  IonInput,
  IonLabel,
  IonNav,
  IonPage,
  IonRouterOutlet,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import React, { createContext, useEffect, useState } from 'react';

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
import { Settings, User } from './lib/types';
import SettingsPage from './pages/Settings';
import HomePage from './pages/HomePage';
import Search from './pages/Search';
import Rooms from './pages/Rooms';
import AnimeInfoPage from './pages/Info/AnimeInfo';
import MovieInfoPage from './pages/Info/MovieInfo';
import TvInfoPage from './pages/Info/TvInfo';
import InfoMode from './pages/Info/InfoMode';
import RoomMode from './pages/Info/RoomMode';
import ChatMode from './pages/Info/ChatMode';

setupIonicReact();

export const UserContext = createContext<User | undefined>(undefined)

const App: React.FC = () => {
	const [name, setName] = useState<string>()
	const [sockId, setSockId] = useState(socket.id)
	const [userData, setUserData] = useState<User>()

	const connectSocket = () => {
		if (!name) {
			alert("Enter a name first!")
			return
		}
		socket.connect()
	}

	socket.on("connect", () => {
		if (!socket.id) return
		setSockId(socket.id)
		console.log(`connected: ${socket.id}`)
		socket.emit("addUser", {
			UserId: socket.id,
			UserName: name,
			UserImage: "https://avatar.iran.liara.run/username?username=" + name
		}, (user: User) => {
			setUserData(user)
		})
	})
	
	useEffect(() => {
		document.title = "PeekABoo"

		return () => {
			socket.off("connect")
		}

	}, [])

	if (!sockId || !userData) {
		return (
			<IonPage>
				<IonTabs>
					<IonTab tab='form'>
						<div className="main">
							<h1>
								The app does NOT save any data. Everything you do here WILL disappear the moment you close your session.
							</h1>
							<form className="form" onSubmit={(e) => {
								e.preventDefault()
								connectSocket()
							}}>
								<IonInput placeholder='Enter a username'
								label='Username'
								fill='outline'
								labelPlacement='floating'
								value={name}
								onIonInput={(e) => setName(e.target.value as string)}
								></IonInput>
								<IonButton type='submit' expand='block' className='form-button'>Submit</IonButton>
							</form>
						</div>
					</IonTab>
					<IonTab tab='settings'>
						<SettingsPage />
					</IonTab>

					<IonTabBar>
						<IonTabButton tab='form'>Form</IonTabButton>
						<IonTabButton tab='settings'>Settings</IonTabButton>
					</IonTabBar>

				</IonTabs>
			</IonPage>
		)
	}

	return (
		<UserContext.Provider value={userData}>
		<IonApp>
			<IonReactRouter>
				<IonRouterOutlet>
					<Switch>
						<Route exact path="/anime/:id" component={InfoMode}/>
						<Route exact path="/movie/:id" component={MovieInfoPage}/>
						<Route exact path="/tv/:id" component={TvInfoPage}/>
						<Route exact path="/room/:id" component={RoomMode}/>
						<Route exact path="/chat/:id" component={ChatMode}/>
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
				</IonRouterOutlet>
			</IonReactRouter>
		</IonApp>
		</UserContext.Provider>
	)
}

export default App;
