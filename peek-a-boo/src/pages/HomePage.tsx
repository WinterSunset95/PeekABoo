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
	IonModal
} from '@ionic/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { MediaInfo, MovieInfo, MovieSearchResult } from '../lib/types';
import { getTrending, getTopAiring } from '../lib/anime';
import List from '../components/List';
import Featured from '../components/Featured'
import './HomePage.css'
import { getFeaturedMovie, getTrendingMovies, getTrendingTv } from '../lib/movies';
import LoadingComponent from '../components/Loading';
import { UserContext } from '../App';
import AuthComponent from '../components/Auth';

const HomePage: React.FC = () => {
	const [trending, setTrending] = useState<MovieSearchResult[]>([])
	const [trendingMovies, setTrendingMovies] = useState<MovieSearchResult[]>([])
	const [trendingTv, setTrendingTv] = useState<MovieSearchResult[]>([])
	const [featured, setFeatured] = useState<MediaInfo>()
	const { user, setUser, name } = useContext(UserContext)
	const [ showToast ] = useIonToast()
	const modalRef = useRef<HTMLIonModalElement>(null)

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

	const loadFeatured = async () => {
		const response = await getFeaturedMovie();
		if (response.peek == false || typeof response.boo == "string") {
			showToast("Error loading top anime")
			return
		}
		setFeatured(response.boo)
	}

	useEffect(() => {
		loadTrending()
		loadTrendingMovies()
		loadTrendingTv()
		loadFeatured()
		console.log(userContext?.user)
	}, [])


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
				<IonModal
					trigger='loginButton'
					backdropBreakpoint={0.5}
					backdropDismiss={true}
					id='loginModal'
					ref={modalRef}
				>
					<AuthComponent modalRef={modalRef} />
				</IonModal>
				{
					featured ?
					<Featured {...featured} />
					: <LoadingComponent choice='card_large' />
				}
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
