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
import { MediaInfo, MovieInfo, MovieSearchResult } from '../lib/types';
import { getTrending, getTopAiring } from '../lib/anime';
import List from '../components/List';
import './HomePage.css'
import { getTrendingMovies, getTrendingTv } from '../lib/movies';
import LoadingComponent from '../components/Loading';
import FriendsListComponent from '../components/FriendsListComponent';
import { UserContext } from '../App';
import AuthComponent from '../components/Auth';
import { onAuthStateChanged } from 'firebase/auth';
import { app, auth } from '../lib/firebase';
import { Favourite, Friend, UserData } from '../lib/models';
import { collection, getDocs, getFirestore, query, where, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { checkmark, close } from 'ionicons/icons';

const HomePage: React.FC = () => {
	const [trending, setTrending] = useState<MovieSearchResult[]>([])
	const [trendingMovies, setTrendingMovies] = useState<MovieSearchResult[]>([])
	const [trendingTv, setTrendingTv] = useState<MovieSearchResult[]>([])
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

	const loadTrending = async () => {
		const response = await getTrending();
		if (response.peek != true) {
			errorMessage("Error loading trending anime")
			return
		}
		setTrending(response.boo)
	}

	const loadTrendingMovies = async () => {
		const res = await getTrendingMovies()
		if (res.peek != true) {
			errorMessage("Error loading trending movies")
			return
		}
		setTrendingMovies(res.boo)
	}

	const loadTrendingTv = async () => {
		const res = await getTrendingTv()
		if (res.peek != true) {
			errorMessage("Error loading trending movies")
			return

		}
		setTrendingTv(res.boo)
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

  const loadFriends = async () => {
    if (!user) return;
    const db = getFirestore(app);
    try {
      const friendsRef = collection(db, 'users', user.uid, 'friends');
      
      // Get actual friends
      const friendsQuery = query(friendsRef, where("status", "==", "friends"));
      const friendsSnapshot = await getDocs(friendsQuery);
      const friendsList = friendsSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Friend));
      setFriend(friendsList);

      // Get incoming friend requests
      const requestsQuery = query(friendsRef, where("status", "==", "received_pending"));
      const requestsSnapshot = await getDocs(requestsQuery);
      const requestsList = requestsSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Friend));
      setFriendRequests(requestsList);

    } catch (error) {
      console.error("Error loading friends and requests:", error)
      errorMessage("Error loading social data")
    }
  }

	useEffect(() => {
		loadTrending()
		loadTrendingMovies()
		loadTrendingTv()
	}, [])

	useEffect(() => {
		if (user) {
			loadFavourites()
			loadFriends()
		}
	}, [user])

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
    if (user != null && auth.currentUser != null) {
        router.push("/home", "root")
    } else {
        router.push("/login", "root")
    }
  }, [user])

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
	
			// Refresh lists
			loadFriends();
	
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
	
			// Refresh lists
			loadFriends();
	
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
				<h1>Trending Shows</h1>
				{
					trendingTv.length > 0 ?
					<List {...trendingTv} />
					: <LoadingComponent choice='list' />
				}
				<h1>Trending Movies</h1>
				{
					trendingMovies.length > 0 ?
					<List {...trendingMovies} />
					: <LoadingComponent choice='list' />
				}
				<h1>Trending Anime</h1>
				{
					trending.length > 0 ? 
					<List {...trending} />
					: <LoadingComponent choice='list' />

				}
			</IonContent>
		</IonPage>
	)
}

export default HomePage
