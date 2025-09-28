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
    useIonRouter,
  IonList,
  IonSpinner,
  IonItem
} from '@ionic/react';
import { useContext, useEffect, useRef, useState } from 'react';
import './HomePage.css'
import FriendsListComponent from '../components/FriendsListComponent';
import { UserContext } from '../App';
import AuthComponent from '../components/Auth';
import { onAuthStateChanged } from 'firebase/auth';
import { app, auth } from '../lib/firebase';
import { Favourite, Friend, UserData } from '../lib/models';
import { collection, getDocs, getDoc, getFirestore, query, where, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { checkmark, close } from 'ionicons/icons';

const HomePage: React.FC = () => {
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [friends, setFriend] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
  const { user, setUser, name } = useContext(UserContext)
  const [ showToast ] = useIonToast()
  const modalRef = useRef<HTMLIonModalElement>(null)
  const router = useIonRouter();

  const errorMessage = (msg: string) => {
    showToast({
      message: msg,
      duration: 3000,
      swipeGesture: "vertical",
      position: "top"
    })
  }

  const loadFavourites = async () => {
    if (!user) return;
    const db = getFirestore(app);
    try {
      const favsRef = collection(db, 'users', user.uid, 'favorites');
      const querySnapshot = await getDocs(favsRef);
      const favs = querySnapshot.docs.map(doc => doc.data() as Favourite);
      setFavourites(favs);
    } catch (error) {
      console.error("Error loading favourites:", error)
      errorMessage("Error loading favourites")
    }
  }

  useEffect(() => {
    if (user) {
      loadFavourites()

      const db = getFirestore(app);
      const friendsRef = collection(db, 'users', user.uid, 'friends');

      // Listener for friends
      const friendsQuery = query(friendsRef, where("status", "==", "friends"));
      const unsubscribeFriends = onSnapshot(friendsQuery, (snapshot) => {
        const friendsList = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Friend));
        setFriend(friendsList);
      }, (error) => {
        console.error("Error listening to friends:", error);
        errorMessage("Error loading friends.");
      });

      // Listener for friend requests
      const requestsQuery = query(friendsRef, where("status", "==", "received_pending"));
      const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
        const requestsList = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Friend));
        setFriendRequests(requestsList);
      }, (error) => {
        console.error("Error listening to friend requests:", error);
        errorMessage("Error loading friend requests.");
      });

      // Cleanup listeners on component unmount or user change
      return () => {
        unsubscribeFriends();
        unsubscribeRequests();
      };
    } else {
      // Clear social data when user logs out
      setFriend([]);
      setFriendRequests([]);
    }
  }, [user])

  useEffect(() => {
    document.title = "PeekABoo"
  }, [])


  const handleAcceptRequest = async (friendUid: string) => {
    if (!user) return;
    try {
      const db = getFirestore(app);
      const now = Date.now();
      
      // Update current user's friend document
      const currentUserFriendRef = doc(db, 'users', user.uid, 'friends', friendUid);
      await updateDoc(currentUserFriendRef, { status: 'friends', since: now });
  
      // Update the other user's friend document
      const otherUserFriendRef = doc(db, 'users', friendUid, 'friends', user.uid);
      await updateDoc(otherUserFriendRef, { status: 'friends', since: now });
  
    } catch (error) {
      console.error("Error accepting friend request:", error);
      errorMessage("Failed to accept friend request.");
    }
  };

  const handleDeclineRequest = async (friendUid: string) => {
    if (!user) return;
    try {
      const db = getFirestore(app);
      
      // Delete from current user's friend list
      const currentUserFriendRef = doc(db, 'users', user.uid, 'friends', friendUid);
      await deleteDoc(currentUserFriendRef);
      
      // Delete from the other user's friend list
      const otherUserFriendRef = doc(db, 'users', friendUid, 'friends', user.uid);
      await deleteDoc(otherUserFriendRef);
  
    } catch (error) {
      console.error("Error declining friend request:", error);
      errorMessage("Failed to decline friend request.");
    }
  };

  const FriendRequestItem: React.FC<{ request: Friend; }> = ({ request }) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const db = getFirestore(app);
          const userRef = doc(db, 'users', request.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
          setUserData(userSnap.data() as UserData);
          }
        } catch (error) {
          console.error("Error fetching user data for request:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }, [request.uid]);
    
    if (loading) {
      return (
      <IonItem>
        <IonSpinner name="crescent" slot="start"></IonSpinner>
        <IonLabel>Loading request...</IonLabel>
      </IonItem>
      );
    }
    
    if (!userData) return null;
    
    return (
      <IonItem>
      <IonAvatar slot="start">
        <img src={userData.photoURL} alt={userData.displayName} />
      </IonAvatar>
      <IonLabel>
        <h2>{userData.displayName}</h2>
        <p>Wants to be your friend.</p>
      </IonLabel>
      <IonButton fill="clear" slot="end" onClick={() => handleAcceptRequest(request.uid)}>
        <IonIcon icon={checkmark} color="success" />
      </IonButton>
      <IonButton fill="clear" slot="end" onClick={() => handleDeclineRequest(request.uid)}>
        <IonIcon icon={close} color="danger" />
      </IonButton>
      </IonItem>
    );
  };

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
      <IonContent className='ion-padding'>
        {friendRequests.length > 0 && (
        <>
          <h1>Friend Requests</h1>
          <IonList>
          {friendRequests.map(req => (
            <FriendRequestItem 
            key={req.uid} 
            request={req}
            />
          ))}
          </IonList>
        </>
        )}
        <h1>Friends</h1>
        <FriendsListComponent friends={friends} />
      </IonContent>
    </IonPage>
  )
}

export default HomePage
