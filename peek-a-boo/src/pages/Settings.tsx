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
	IonTitle,
	IonToolbar,
	useIonRouter,
} from "@ionic/react"

import React, { useContext } from "react"
import "./Settings.css"
import { UserContext } from "../App"
import { auth } from "../lib/firebase"
import { logOutOutline, personCircleOutline, trashOutline } from "ionicons/icons"

const SettingsPage: React.FC = () => {
	const { user, setUser } = useContext(UserContext)
	const router = useIonRouter()

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
