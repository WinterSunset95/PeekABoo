import {
	IonPage,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
	IonIcon,
	IonInput
} from '@ionic/react'
import { useEffect, useState } from 'react'
import { searchAnime } from '../lib/anime'
import { MovieSearchResult } from '../lib/types'
import List from './List'
import { searchMovie, searchTv } from '../lib/movies'

const Search: React.FC = () => {

	const [search, setSearch] = useState('')
	const [anime, setAnime] = useState<MovieSearchResult[]>([])
	const [movie, setMovie] = useState<MovieSearchResult[]>([])
	const [tv, setTv] = useState<MovieSearchResult[]>([])

	const loadAnime = async () => {
		const res = await searchAnime(search)
		if (res.peek == false) {
			console.log("Error loading anime")
			return
		}
		setAnime(res.boo)
	}

	const loadMovie = async () => {
		const res = await searchMovie(search)
		if (res.peek == false) {
			console.log("Error loading movies")
			return
		}
		setMovie(res.boo)
	}

	const loadTv = async () => {
		const res = await searchTv(search)
		if (res.peek == false) return;
		setTv(res.boo)
	}

	useEffect(() => {
		loadAnime()
		loadMovie()
		loadTv()
	}, [search])

	return (
		<IonPage>
			<IonHeader
				translucent={true}
				className='ion-padding'
			>
				Search
			</IonHeader>
			<IonContent className="ion-padding">
				<IonInput
					label="Search Movies, TV Shows, Anime"
					labelPlacement="floating"
					fill="outline"
					value={search}
					onIonInput={(e) => setSearch(e.target.value as string)}
				>
				</IonInput>
				<h1>Anime</h1>
				<List {...anime} />
				<h1>Movies</h1>
				<List {...movie} />
				<h1>Tv</h1>
				<List {...tv} />
			</IonContent>
		</IonPage>
	)
}

export default Search
