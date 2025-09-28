import {
	IonAvatar,
	IonButton,
	IonContent,
	IonHeader,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonListHeader,
	IonPage,
	IonSelect,
	IonSelectOption,
	IonTitle,
	IonToolbar,
	useIonAlert,
	useIonRouter,
} from "@ionic/react"

import React, { useContext, useEffect, useState } from "react"
import "./Settings.css"
import { UserContext } from "../App"
import { auth } from "../lib/firebase"
import { logOutOutline, personCircleOutline, trashOutline } from "ionicons/icons"
import { AnimeSourceOptions, AnimeTypeOptions, MovieSourceoptions, ServerOptions, Settings, SettingsAnimeSources, SettingsAnimeTypes, SettingsMovieSources, SettingsServers } from "../lib/types"
import { getSettings, setSettings } from "../lib/storage"

const SettingsPage: React.FC = () => {
	const { user, setUser } = useContext(UserContext)
	const router = useIonRouter()
	const [ openAlert ] = useIonAlert()

	const [type, setType] = useState<AnimeTypeOptions>()
	const [aniSource, setAniSource] = useState<AnimeSourceOptions>()
	const [movSource, setMovSource] = useState<MovieSourceoptions>()
	const [server, setServer] = useState<ServerOptions>()

	const loadSettings = async () => {
		const settings = await getSettings()
		if (settings.peek == false) {
			openAlert("Failed to load settings. This is not supposed to happen")
			return
		}
		const appSettings = settings.boo as Settings
		setType(appSettings.AnimeType)
		setAniSource(appSettings.AnimeSource)
		setMovSource(appSettings.MovieSource)
		setServer(appSettings.Server)
	}

	useEffect(() => {
		loadSettings()
	}, [])

	const changeSettings = async () => {
		if (!type || !aniSource || !movSource || !server) return;
		const newSettings: Settings = {
			AnimeType: type,
			AnimeSource: aniSource,
			MovieSource: movSource,
			Server: server
		}
		const res = await setSettings(newSettings)
		if (res.peek == false || typeof res.boo == "string") {
			openAlert(res.boo as string)
			return
		} else {
			openAlert({
				header: 'Settings Saved',
				message: 'Your new settings have been saved. The app will now reload to apply them.',
				buttons: [{
					text: 'OK',
					handler: () => {
						window.location.reload();
					}
				}]
			})
		}
	}

	const handleLogout = async () => {
		await auth.signOut()
		setUser(null)
		router.push("/home", "root", "replace")
	}

	if (!user) {
		return (
			<IonPage>
				<IonHeader>
					<IonToolbar>
						<IonTitle>Settings</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent className="ion-padding">
					<div className="settings-login-prompt">
						<h2>Please Log In</h2>
						<p>Log in to manage your account settings.</p>
						<IonButton routerLink="/login" expand="block">Login</IonButton>
					</div>
				</IonContent>
			</IonPage>
		)
	}

	return (
		<IonPage>
			<IonHeader translucent={true}>
				<IonToolbar>
					<IonTitle>Settings</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<div className="settings-user-header">
					<IonAvatar className="settings-avatar">
						<img src={user.photoURL ?? ""} alt={user.displayName ?? ""} />
					</IonAvatar>
					<h2>{user.displayName}</h2>
					<p>{user.email}</p>
				</div>

				<IonListHeader>Account</IonListHeader>
				<IonList inset={true}>
					<IonItem button detail={true} disabled>
						<IonIcon icon={personCircleOutline} slot="start" />
						<IonLabel>Edit Profile</IonLabel>
					</IonItem>
				</IonList>

				<IonListHeader>Application Settings</IonListHeader>
				<IonList inset={true}>
					<IonItem>
						<IonSelect
							label="Advertisements"
							value={type}
							onIonChange={(e) => setType(e.target.value)}
						>
							{SettingsAnimeTypes.map((item, index) => (
								<IonSelectOption
									value={item}
									key={index}
								>
									{item}
								</IonSelectOption>
							))}
						</IonSelect>
					</IonItem>
					<IonItem>
						<IonSelect
							label="Anime Source"
							value={aniSource}
							onIonChange={(e) => setAniSource(e.target.value)}
						>
							{SettingsAnimeSources.map((item, index) => (
								<IonSelectOption
									value={item}
									key={index}
								>
									{item}
								</IonSelectOption>
							))}
						</IonSelect>
					</IonItem>
					<IonItem>
						<IonSelect
							label="Movie Source"
							value={movSource}
							onIonChange={(e) => setMovSource(e.target.value)}
						>
							{SettingsMovieSources.map((item, index) => (
								<IonSelectOption
									value={item}
									key={index}
								>
									{item}
								</IonSelectOption>
							))}
						</IonSelect>
					</IonItem>
					<IonItem lines="none">
						<IonSelect
							label="Backend Server"
							value={server}
							onIonChange={(e) => setServer(e.target.value)}
						>
							{SettingsServers.map((item, index) => (
								<IonSelectOption
									value={item}
									key={index}
								>
									{item}
								</IonSelectOption>
							))}
						</IonSelect>
					</IonItem>
				</IonList>
				<IonButton expand="block" onClick={changeSettings} disabled={!type} className="ion-margin">Save Settings</IonButton>

				<IonListHeader>Danger Zone</IonListHeader>
				<IonList inset={true}>
					<IonItem button onClick={handleLogout}>
						<IonIcon icon={logOutOutline} slot="start" color="danger" />
						<IonLabel color="danger">Logout</IonLabel>
					</IonItem>
					<IonItem button lines="none" disabled>
						<IonIcon icon={trashOutline} slot="start" color="danger" />
						<IonLabel color="danger">Delete Account</IonLabel>
					</IonItem>
				</IonList>
			</IonContent>
		</IonPage>
	)
}

export default SettingsPage
