import {
	IonPage,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar
} from '@ionic/react';

const Home: React.FC = () => {
	return (
		<IonPage>
			<IonHeader>
				<IonTitle>Home</IonTitle>
			</IonHeader>
			<IonContent fullscreen>
				<h1>Home</h1>
				<p>This is the home page of the streaming app</p>
			</IonContent>
		</IonPage>
	)
}

export default Home;
