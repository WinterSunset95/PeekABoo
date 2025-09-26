import {
	IonPage,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
	IonIcon,
	IonButton,
	IonChip,
	IonAvatar,
	IonLabel,
	useIonToast,
	IonModal,
    useIonRouter
} from '@ionic/react';
import { onAuthStateChanged } from 'firebase/auth';
import { useContext, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { UserContext } from '../App';

const PeoplePage: React.FC = () => {
  const { user, setUser, name } = useContext(UserContext)
  const [ showToast ] = useIonToast();
  const router = useIonRouter()

	useEffect(() => {
		document.title = "PeekABoo"
    onAuthStateChanged(auth, (newLoginUser) => {
      if (newLoginUser != null) {
        setUser(newLoginUser)
      } else {
        setUser(null)
      }
    })
	}, [])

  useEffect(() => {
    console.log(user, auth.currentUser)
    if (user != null && auth.currentUser != null) {
        router.push("/home", "root")
    } else {
        router.push("/login", "root")
    }
  }, [user])

  return (
    <IonPage>
			<IonHeader
				translucent={true}
			>
				<IonToolbar
					style={{
						paddingRight: "1rem"
					}}
				>
					<IonTitle>Peek-A-Boo</IonTitle>
					{user ? user.email
					? 
						<IonChip slot='end'
							onClick={() => {
								showToast({
									message: `UserID: ${user.email}`,
									duration: 3000,
									position: "top",
									swipeGesture: "vertical"
								})
							}}
						>
							<IonAvatar>
								<img src={user.photoURL ?? ""} alt="" />
							</IonAvatar>
							<IonLabel>{user.displayName}</IonLabel>
						</IonChip>
					: <IonButton id='loginButton' slot='end'>Login</IonButton>
					: <IonButton id='loginButton' slot='end'>Login</IonButton>
					}
				</IonToolbar>
			</IonHeader>
      <IonContent>
        <div>Hello there</div>
      </IonContent>
    </IonPage>
  )
}

export default PeoplePage;
