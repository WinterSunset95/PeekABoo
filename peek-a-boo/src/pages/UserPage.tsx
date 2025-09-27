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
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { app, auth } from "../lib/firebase";
import { UserContext } from "../App";

interface UserPageProps extends RouteComponentProps<{
  id: string
}> {}

const UserPage: React.FC<UserPageProps> = ({ match }) => {
  const { user } = useContext(UserContext);
  const router = useIonRouter();
  const [profileUser, setProfileUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [friendStatus, setFriendStatus] = useState<'loading' | 'not_friends' | 'sent_pending' | 'received_pending' | 'friends'>('loading');
  const [isProcessing, setIsProcessing] = useState(false);
  const userId = match.params.id;

  useEffect(() => {
    if (!userId) return;

    if (user?.uid === userId) {
      router.push('/settings', 'root', 'replace');
      return;
    }

    const fetchUserDataAndStatus = async () => {
      setLoading(true);
      try {
        const db = getFirestore(app);
        // Fetch profile user data
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setProfileUser({ uid: userSnap.id, ...userSnap.data() } as UserData);
        } else {
          console.warn(`User document not found for uid: ${userId}`);
          setProfileUser(null);
          setLoading(false);
          return;
        }

        // Fetch friendship status
        if (user) {
          const friendRef = doc(db, 'users', user.uid, 'friends', userId);
          const friendSnap = await getDoc(friendRef);
          if (friendSnap.exists()) {
            setFriendStatus(friendSnap.data().status as 'sent_pending' | 'received_pending' | 'friends');
            console.log(friendSnap.data().status)
          } else {
            setFriendStatus('not_friends');
          }
        } else {
          setFriendStatus('not_friends'); // Not logged in, can't be friends
        }

      } catch (error) {
        console.error("Error fetching user data or friend status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndStatus();
  }, [userId, user, router]);

  const handleAddFriend = async () => {
    if (!user || !profileUser || isProcessing) return;

    setIsProcessing(true);
    try {
      const db = getFirestore(app);
      const now = Date.now();

      // For the sender
      const sentRequestData = { status: 'sent_pending', since: now, uid: profileUser.uid };
      const currentUserFriendRef = doc(db, 'users', user.uid, 'friends', profileUser.uid);
      await setDoc(currentUserFriendRef, sentRequestData);

      // For the recipient
      const receivedRequestData = { status: 'received_pending', since: now, uid: user.uid };
      const profileUserFriendRef = doc(db, 'users', profileUser.uid, 'friends', user.uid);
      await setDoc(profileUserFriendRef, receivedRequestData);

      setFriendStatus('sent_pending');
    } catch (error) {
      console.error("Error adding friend:", error);
    } finally {
      setIsProcessing(false);
    }
  };

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
          <IonButton
            expand="block"
            onClick={handleAddFriend}
            disabled={friendStatus !== 'not_friends' || isProcessing || !user}
          >
            {isProcessing ? <IonSpinner name="crescent" /> :
              !user ? 'Login to Add Friend' :
              friendStatus === 'sent_pending' ? 'Request Sent' :
              friendStatus === 'received_pending' ? 'Incoming Request' :
              friendStatus === 'friends' ? 'Friends' :
              'Add Friend'
            }
          </IonButton>
          <IonButton expand="block" color="warning" disabled>
            Block User
          </IonButton>
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
