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
import { Favourite, Friend } from '../lib/models';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

const HomePage: React.FC = () => {
	const [trending, setTrending] = useState<MovieSearchResult[]>([])
	const [trendingMovies, setTrendingMovies] = useState<MovieSearchResult[]>([])
	const [trendingTv, setTrendingTv] = useState<MovieSearchResult[]>([])
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [friends, setFriend] = useState<Friend[]>([]);
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
      const q = query(friendsRef, where("status", "==", "friends"));
      const querySnapshot = await getDocs(q);
      const friendsList = querySnapshot.docs.map(doc => doc.data() as Friend);
      setFriend(friendsList);
    } catch (error) {
      console.error("Error loading friends:", error)
      errorMessage("Error loading friends")
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
			<IonContent className='ion-padding'>
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
