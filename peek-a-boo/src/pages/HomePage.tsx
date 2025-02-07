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
	useIonToast
} from '@ionic/react';
import { useContext, useEffect, useState } from 'react';
import { MovieInfo, MovieSearchResult } from '../lib/types';
import { getTrending, getTopAiring } from '../lib/anime';
import List from '../components/List';
import Featured from '../components/Featured'
import './HomePage.css'
import { getTrendingMovies, getTrendingTv } from '../lib/movies';
import LoadingComponent from '../components/Loading';
import { UserContext } from '../App';

const HomePage: React.FC = () => {
	const [trending, setTrending] = useState<MovieSearchResult[]>([])
	const [trendingMovies, setTrendingMovies] = useState<MovieSearchResult[]>([])
	const [trendingTv, setTrendingTv] = useState<MovieSearchResult[]>([])
	const [featured, setFeatured] = useState<MovieInfo>()
	const userContext = useContext(UserContext)
	const [ showToast ] = useIonToast()

	const loadTrending = async () => {
		const response = await getTrending();
		if (response.peek == false) {
			alert("Error loading trending anime")
			return
		}
		setTrending(response.boo)
	}

	const loadTrendingMovies = async () => {
		const res = await getTrendingMovies()
		if (res.peek == false) {
			alert("Error loading trending movies")
			return

		}
		setTrendingMovies(res.boo)
	}

	const loadTrendingTv = async () => {
		const res = await getTrendingTv()
		if (res.peek == false) {
			alert("Error loading trending movies")
			return

		}
		setTrendingTv(res.boo)
	}

	const loadFeatured = async () => {
		const response = await getTopAiring();
		if (response.peek == false) {
			alert("Error loading top anime")
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
					{userContext ? userContext.user 
					? 
						<IonChip slot='end'
							onClick={() => {
								showToast({
									message: `UserID: ${userContext.user?.UserId}`,
									duration: 3000,
									position: "top",
									swipeGesture: "vertical"
								})
							}}
						>
							<IonAvatar>
								<img src={userContext.user.UserImage} alt="" />
							</IonAvatar>
							<IonLabel>{userContext.user.UserName}</IonLabel>
						</IonChip>
					: <IonButton routerLink='/login' slot='end'>Login</IonButton>
					: <IonButton routerLink='/login' slot='end'>Login</IonButton>
					}
				</IonToolbar>
			</IonHeader>
			<IonContent className='ion-padding'>
				{
					featured ?
					<Featured {...featured} />
					: <LoadingComponent choice='card_large' />
				}
				<h1>Trending Anime</h1>
				{
					trending.length > 1 ? 
					<List {...trending} />
					: <LoadingComponent choice='list' />

				}
				<h1>Trending Movies</h1>
				{
					trendingMovies.length > 1?
					<List {...trendingMovies} />
					: <LoadingComponent choice='list' />
				}
				<h1>Trending Shows</h1>
				{
					trendingTv.length > 1 ?
					<List {...trendingTv} />
					: <LoadingComponent choice='list' />
				}

			</IonContent>
		</IonPage>
	)
}

export default HomePage
