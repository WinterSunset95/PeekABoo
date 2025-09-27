import {
	IonPage,
	IonContent,
	IonHeader,
	IonToolbar,
	IonInput,
	IonSegment,
	IonSegmentButton,
	IonLabel
} from '@ionic/react'
import { useEffect, useState } from 'react'
import { searchAnime } from '../lib/anime'
import { MovieSearchResult, MovieInfo } from '../lib/types'
import { searchMovie, searchTv } from '../lib/movies'
import LoadingComponent from '../components/Loading'
import ListVert from '../components/ListVert'

const Search: React.FC = () => {
	const [segment, setSegment] = useState('movies');
	const [search, setSearch] = useState('')
	const [anime, setAnime] = useState<MovieInfo[]>([])
	const [movie, setMovie] = useState<MovieInfo[]>([])
	const [tv, setTv] = useState<MovieInfo[]>([])

	useEffect(() => {
		const searchTimer = setTimeout(() => {
			if (search) {
				const loadData = async () => {
					const [animeRes, movieRes, tvRes] = await Promise.all([
						searchAnime(search),
						searchMovie(search),
						searchTv(search)
					]);
					//if (animeRes.peek) setAnime(animeRes.boo);
					if (movieRes.peek) setMovie(movieRes.boo);
					if (tvRes.peek) setTv(tvRes.boo);
				}
				loadData();
			} else {
				setAnime([])
				setMovie([])
				setTv([])
			}
		}, 500); // Debounce search
	
		return () => clearTimeout(searchTimer);
	}, [search])

	const renderContent = () => {
		switch (segment) {
			case 'people':
				return <p style={{ textAlign: 'center', marginTop: '20px' }}>People search is not yet implemented.</p>;
			case 'movies':
				return movie.length > 0 ? <ListVert {...movie} /> : (search ? <LoadingComponent choice='vert-list' /> : <p style={{ textAlign: 'center', marginTop: '20px' }}>Search for movies.</p>);
			case 'shows':
				return tv.length > 0 ? <ListVert {...tv} /> : (search ? <LoadingComponent choice='vert-list' /> : <p style={{ textAlign: 'center', marginTop: '20px' }}>Search for TV shows.</p>);
			case 'anime':
				return anime.length > 0 ? <ListVert {...anime} /> : (search ? <LoadingComponent choice='vert-list' /> : <p style={{ textAlign: 'center', marginTop: '20px' }}>Search for anime.</p>);
			default:
				return null;
		}
	}

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonInput
						placeholder="Search..."
						value={search}
						onIonInput={(e) => setSearch(e.target.value as string)}
						clearInput
						style={{'--padding-start': '16px', '--padding-end': '16px'}}
					>
					</IonInput>
				</IonToolbar>
				<IonToolbar>
					<IonSegment value={segment} onIonChange={e => setSegment(e.detail.value!.toString())}>
						<IonSegmentButton value="people">
							<IonLabel>People</IonLabel>
						</IonSegmentButton>
						<IonSegmentButton value="movies">
							<IonLabel>Movies</IonLabel>
						</IonSegmentButton>
						<IonSegmentButton value="shows">
							<IonLabel>Shows</IonLabel>
						</IonSegmentButton>
						<IonSegmentButton value="anime">
							<IonLabel>Anime</IonLabel>
						</IonSegmentButton>
					</IonSegment>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				{renderContent()}
			</IonContent>
		</IonPage>
	)
}

export default Search
