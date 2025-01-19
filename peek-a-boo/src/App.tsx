import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonNav,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, home, person, search, square, triangle } from 'ionicons/icons';
import Home from './pages/Home';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

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
import { createContext, useEffect, useMemo, useState } from 'react';
import { Settings } from './lib/types';
import { AppSettings } from './AppContext';

setupIonicReact();

const App: React.FC = () => {
	const [settings, setSettings] = useState<Settings>({
		AnimeType: "adfree",
		AnimeSource: "gogo",
		MovieSource: "tmdb",
		Server: "http://localhost:3000"
	})

	const contextValue = useMemo(() => ({ settings, setSettings }), [settings])

	useEffect(() => {
		const currSettings = localStorage.getItem("PeekABooSettings")
		if (currSettings) {
			const toSet = JSON.parse(currSettings) as Settings
			setSettings(toSet)
			return
		}

		const globalSettings: Settings = {
			AnimeType: "adfree",
			AnimeSource: "gogo",
			MovieSource: "tmdb",
			Server: "http://localhost:3000"
		}
		localStorage.setItem("PeekABooSettings", JSON.stringify(globalSettings))
		setSettings(globalSettings)

	}, [])

	return (
		<AppSettings.Provider value={contextValue}>
		  <IonApp>
			<IonReactRouter>
				<IonRouterOutlet>
				  <Route exact path="/">
					<IonNav root={() => <Home />}>
					</IonNav>
				  </Route>
				  <Route exact path="/signin">
					<Tab2 />
				  </Route>
				  <Route path="/signup">
					<Tab3 />
				  </Route>
				</IonRouterOutlet>
			</IonReactRouter>
		  </IonApp>
		</AppSettings.Provider>
	)
}

export default App;
