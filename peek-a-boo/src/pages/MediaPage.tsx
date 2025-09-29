// TODO: Remove IonPage and IonContent when Ionic is fully removed.
import {
  IonContent,
  IonPage,
} from '@ionic/react';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { getTrending } from '../lib/anime';
import { getTrendingMovies, getTrendingTv } from '../lib/movies';
import { MovieSearchResult, MovieInfo } from '../lib/types';
import List from '../components/List';
import LoadingComponent from '../components/Loading';
import FeaturedCard from '../components/FeaturedCard';

const MediaPage: React.FC = () => {
  const [trending, setTrending] = useState<MovieSearchResult[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<MovieInfo[]>([]);
  const [trendingTv, setTrendingTv] = useState<MovieInfo[]>([]);
  const [featuredItem, setFeaturedItem] = useState<MovieInfo | null>(null);

  const errorMessage = (msg: string) => {
    toast.error(msg);
  };

  const loadTrending = async () => {
    const response = await getTrending();
    if (response.peek != true) {
      errorMessage("Error loading trending anime");
      return;
    }
    setTrending(response.boo);
  };

  const loadTrendingMovies = async () => {
    const res = await getTrendingMovies();
    if (res.peek != true) {
      errorMessage("Error loading trending movies");
      return;
    }
    setTrendingMovies(res.boo);
    if (res.boo.length > 0) {
      setFeaturedItem(res.boo[0]);
    }
  };

  const loadTrendingTv = async () => {
    const res = await getTrendingTv();
    console.log(res)
    if (res.peek != true) {
      errorMessage("Error loading trending TV");
      return;
    }
    setTrendingTv(res.boo);
  };

  useEffect(() => {
    loadTrending();
    loadTrendingMovies();
    loadTrendingTv();
  }, []);

  return (
    <IonPage>
      {/* TODO: Remove IonPage and IonContent when Ionic is fully removed. */}
      <header className="p-4 border-b sticky top-0 bg-background z-10">
        <h1 className="text-xl font-bold">Media</h1>
      </header>
      <IonContent>
        <main className="p-4 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Featured</h2>
            {featuredItem ? (
              <FeaturedCard item={featuredItem} />
            ) : <LoadingComponent choice='list' />}
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">Trending Shows</h2>
            {
              trendingTv.length > 0 ?
                <List {...trendingTv} />
                : <LoadingComponent choice='list' />
            }
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">Trending Movies</h2>
            {
              trendingMovies.length > 0 ?
                <List {...trendingMovies} />
                : <LoadingComponent choice='list' />
            }
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">Trending Anime</h2>
            {
              trending.length > 0 ?
                <List {...trending} />
                : <LoadingComponent choice='list' />
            }
          </section>
        </main>
      </IonContent>
    </IonPage>
  );
};

export default MediaPage;
