import { useEffect, useState } from 'react'
import { searchAnime } from '../lib/anime'
import { MovieInfo } from '../lib/types'
import { searchMovie, searchTv } from '../lib/movies'
import LoadingComponent from '../components/Loading'
import ListVert from '../components/ListVert'
import DetailCard from '../components/DetailCard'
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
import { app } from '../lib/firebase'
import { UserData } from '../lib/models'
import UserListItem from '../components/UserListItem'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search as SearchIcon } from 'lucide-react'

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

  return (
    <>
      <header className="p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onInput={(e) => setSearch(e.currentTarget.value)}
            className="pl-10"
          />
        </div>
      </header>
        <main className="p-4">
          <Tabs value={segment} onValueChange={setSegment}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="people">People</TabsTrigger>
              <TabsTrigger value="movies">Movies</TabsTrigger>
              <TabsTrigger value="shows">Shows</TabsTrigger>
              <TabsTrigger value="anime">Anime</TabsTrigger>
            </TabsList>
            <TabsContent value="people" className="mt-4">
              {people.length > 0 ? (
                <ListVert
                  items={people}
                  renderItem={(user) => <UserListItem key={user.uid} user={user} />}
                />
              ) : (search ? <LoadingComponent choice='vert-list' /> : <p className="text-center text-muted-foreground mt-5">Search for people.</p>)}
            </TabsContent>
            <TabsContent value="movies" className="mt-4">
              {movie.length > 0 ? (
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
              ) : (search ? <LoadingComponent choice='vert-list' /> : <p className="text-center text-muted-foreground mt-5">Search for movies.</p>)}
            </TabsContent>
            <TabsContent value="shows" className="mt-4">
              {tv.length > 0 ? (
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
              ) : (search ? <LoadingComponent choice='vert-list' /> : <p className="text-center text-muted-foreground mt-5">Search for TV shows.</p>)}
            </TabsContent>
            <TabsContent value="anime" className="mt-4">
              {anime.length > 0 ? (
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
              ) : (search ? <LoadingComponent choice='vert-list' /> : <p className="text-center text-muted-foreground mt-5">Search for anime.</p>)}
            </TabsContent>
          </Tabs>
        </main>
    </>
  )
}

export default Search
