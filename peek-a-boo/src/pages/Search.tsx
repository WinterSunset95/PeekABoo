import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonInput,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList
} from '@ionic/react'
import { useEffect, useState } from 'react'
import { searchAnime } from '../lib/anime'
import { MovieSearchResult, MovieInfo } from '../lib/types'
import { searchMovie, searchTv } from '../lib/movies'
import LoadingComponent from '../components/Loading'
import ListVert from '../components/ListVert'
import DetailCard from '../components/DetailCard'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { app } from '../lib/firebase'
import { UserData } from '../lib/models'
import UserListItem from '../components/UserListItem'

const Search: React.FC = () => {
  const [segment, setSegment] = useState('people');
  const [search, setSearch] = useState('')
  const [anime, setAnime] = useState<MovieInfo[]>([])
  const [movie, setMovie] = useState<MovieInfo[]>([])
  const [tv, setTv] = useState<MovieInfo[]>([])
  const [people, setPeople] = useState<UserData[]>([])

  useEffect(() => {
    const searchTimer = setTimeout(() => {
      if (search) {
        const loadData = async () => {
          if (segment === 'people') {
            setAnime([]); setMovie([]); setTv([]);
            const db = getFirestore(app);
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('displayName', '>=', search), where('displayName', '<=', search + '\uf8ff'));
            const querySnapshot = await getDocs(q);
            const users: UserData[] = [];
            querySnapshot.forEach((doc) => {
              users.push({ uid: doc.id, ...doc.data() } as UserData);
            });
            setPeople(users);
          } else {
            setPeople([]);
            const [animeRes, movieRes, tvRes] = await Promise.all([
              searchAnime(search),
              searchMovie(search),
              searchTv(search)
            ]);
            //if (animeRes.peek) setAnime(animeRes.boo);
            if (movieRes.peek) setMovie(movieRes.boo);
            if (tvRes.peek) setTv(tvRes.boo);
          }
        }
        loadData();
      } else {
        setAnime([])
        setMovie([])
        setTv([])
        setPeople([])
      }
    }, 500); // Debounce search
  
    return () => clearTimeout(searchTimer);
  }, [search, segment])

  const renderContent = () => {
    switch (segment) {
      case 'people':
        return people.length > 0 ? (
          <ListVert
            items={people}
            renderItem={(user) => <UserListItem key={user.uid} user={user} />}
          />
        ) : (search ? <LoadingComponent choice='vert-list' /> : <p style={{ textAlign: 'center', marginTop: '20px' }}>Search for people.</p>);
      case 'movies':
        return movie.length > 0 ? (
          <ListVert
            items={movie}
            renderItem={(item) => (
              <DetailCard
                key={item.Id}
                imageUrl={item.Poster}
                title={item.Title}
                linkUrl={item.Type === "anime" ? `/anime/${item.Id}` : item.Type === "movie" ? `/movie/${item.Id}` : `/tv/${item.Id}`}
                type={item.Type}
                year={item.Year}
                duration={item.Duration}
                overview={item.Overview}
              />
            )}
          />
        ) : (search ? <LoadingComponent choice='vert-list' /> : <p style={{ textAlign: 'center', marginTop: '20px' }}>Search for movies.</p>);
      case 'shows':
        return tv.length > 0 ? (
          <ListVert
            items={tv}
            renderItem={(item) => (
              <DetailCard
                key={item.Id}
                imageUrl={item.Poster}
                title={item.Title}
                linkUrl={item.Type === "anime" ? `/anime/${item.Id}` : item.Type === "movie" ? `/movie/${item.Id}` : `/tv/${item.Id}`}
                type={item.Type}
                year={item.Year}
                duration={item.Duration}
                overview={item.Overview}
              />
            )}
          />
        ) : (search ? <LoadingComponent choice='vert-list' /> : <p style={{ textAlign: 'center', marginTop: '20px' }}>Search for TV shows.</p>);
      case 'anime':
        return anime.length > 0 ? (
          <ListVert
            items={anime}
            renderItem={(item) => (
              <DetailCard
                key={item.Id}
                imageUrl={item.Poster}
                title={item.Title}
                linkUrl={item.Type === "anime" ? `/anime/${item.Id}` : item.Type === "movie" ? `/movie/${item.Id}` : `/tv/${item.Id}`}
                type={item.Type}
                year={item.Year}
                duration={item.Duration}
                overview={item.Overview}
              />
            )}
          />
        ) : (search ? <LoadingComponent choice='vert-list' /> : <p style={{ textAlign: 'center', marginTop: '20px' }}>Search for anime.</p>);
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
