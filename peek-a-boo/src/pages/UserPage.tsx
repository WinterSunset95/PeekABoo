import { RouteComponentProps } from "react-router";
import {
	IonPage,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
	IonButton,
	IonAvatar,
	useIonRouter,
    IonButtons,
    IonBackButton,
    IonSpinner
} from '@ionic/react';
import { useContext, useEffect, useState } from 'react';
import './UserPage.css'
import { UserData } from "../lib/models";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app, auth } from "../lib/firebase";
import { UserContext } from "../App";

interface UserPageProps extends RouteComponentProps<{
  id: string
}> {}

const UserPage: React.FC<UserPageProps> = ({ match }) => {
  const { user, setUser } = useContext(UserContext);
  const router = useIonRouter();
  const [profileUser, setProfileUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = match.params.id;

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const db = getFirestore(app);
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setProfileUser({ uid: userSnap.id, ...userSnap.data() } as UserData);
        } else {
          console.warn(`User document not found for uid: ${userId}`);
          setProfileUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    router.push('/home', 'root', 'replace');
  };

  const isCurrentUser = user?.uid === userId;

  const renderContent = () => {
    if (loading) {
      return <div className="spinner-container"><IonSpinner /></div>;
    }

    if (!profileUser) {
      return <div className="user-not-found">User not found.</div>;
    }

    return (
      <div className="user-profile-container">
        <IonAvatar className="user-profile-avatar">
          <img src={profileUser.photoURL} alt={profileUser.displayName} />
        </IonAvatar>
        <h1 className="user-profile-name">{profileUser.displayName}</h1>
        <p className="user-profile-email">{profileUser.email}</p>
        <p className="user-profile-created">
          Member since {new Date(profileUser.createdAt).toLocaleDateString()}
        </p>

        <div className="user-profile-actions">
          {isCurrentUser ? (
            <>
              <IonButton expand="block" disabled>Edit Profile</IonButton>
              <IonButton expand="block" color="danger" onClick={handleLogout}>
                Logout
              </IonButton>
            </>
          ) : (
            <>
              <IonButton expand="block" disabled>Add Friend</IonButton>
              <IonButton expand="block" color="warning" disabled>
                Block User
              </IonButton>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/search" />
          </IonButtons>
          <IonTitle>{profileUser?.displayName || 'User Profile'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {renderContent()}
      </IonContent>
    </IonPage>
  )
}

export default UserPage
