import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { getTrending } from '../lib/anime';
import { getTrendingMovies, getTrendingTv } from '../lib/movies';
import { MovieSearchResult } from '../lib/types';
import List from '../components/List';
import LoadingComponent from '../components/Loading';
import './HomePage.css'

const MediaPage: React.FC = () => {
  const [trending, setTrending] = useState<MovieSearchResult[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<MovieSearchResult[]>([]);
  const [trendingTv, setTrendingTv] = useState<MovieSearchResult[]>([]);
  const [showToast] = useIonToast();

  const errorMessage = (msg: string) => {
    showToast({
      message: msg,
      duration: 3000,
      swipeGesture: "vertical",
      position: "top"
    });
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
  };

  const loadTrendingTv = async () => {
    const res = await getTrendingTv();
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
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>Media</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
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
  );
};

export default MediaPage;
