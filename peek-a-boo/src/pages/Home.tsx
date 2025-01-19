import {
	IonPage,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
	IonTabs,
	IonTab,
	IonTabBar,
	IonTabButton,
	IonIcon,
	IonLabel,
	IonNav
} from '@ionic/react';

import HomePage from '../components/HomePage';
import Search from '../components/Search'
import { home, person, search, settings } from 'ionicons/icons';
import AccountPage from '../components/Account';
import SettingsPage from '../components/Settings';

const Home: React.FC = () => {

	return (
		<IonTabs>
			<IonTab tab='home'>
				<HomePage />
			</IonTab>
			<IonTab tab='search'>
				<Search />
			</IonTab>
			<IonTab tab='settings'>
				<SettingsPage />
			</IonTab>

			<IonTabBar slot='bottom'>

				<IonTabButton tab='home'>
					<IonIcon icon={home}></IonIcon>
					<IonLabel>Home</IonLabel>
				</IonTabButton>
				<IonTabButton tab='search'>
					<IonIcon icon={search}></IonIcon>
					<IonLabel>Search</IonLabel>
				</IonTabButton>
				<IonTabButton tab='settings'>
					<IonIcon icon={settings}></IonIcon>
					<IonLabel>Settings</IonLabel>
				</IonTabButton>

			</IonTabBar>
		</IonTabs>
	)
}

export default Home;
