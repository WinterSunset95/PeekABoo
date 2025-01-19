import {
	IonPage,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
	IonIcon
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { MovieInfo, MovieSearchResult } from '../lib/types';
import { getTrending, getTopAiring } from '../lib/anime';
import List from './List';
import Featured from './Featured'
import './HomePage.css'

const HomePage: React.FC = () => {
	const [trending, setTrending] = useState<MovieSearchResult[]>([])
	const [featured, setFeatured] = useState<MovieInfo>()

	const loadTrending = async () => {
		const response = await getTrending();
		if (response.peek == false) {
			alert("Error loading trending anime")
			return
		}
		setTrending(response.boo)
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
		loadFeatured()
	}, [])

	return (
		<IonPage>
			<IonHeader
				translucent={true}
				className='ion-padding'
			>
				<IonTitle>Peek-A-Boo</IonTitle>
			</IonHeader>
			<IonContent className='ion-padding'>
				{
					featured ?
					<Featured {...featured} />
					: "Loading"
				}
				<h1>Trending Anime</h1>
				<List {...trending} />
			</IonContent>
		</IonPage>
	)
}

export default HomePage
