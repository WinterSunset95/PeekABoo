import {
	IonPage,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
} from '@ionic/react'

const AccountPage: React.FC = () => {
	return (
		<IonPage>
			<IonHeader
				translucent={true}
				className='ion-padding'
			>
				Account Page
			</IonHeader>
			<IonContent className='ion-padding'>
				<h1>Not implemented yet</h1>
			</IonContent>
		</IonPage>
	)
}

export default AccountPage
