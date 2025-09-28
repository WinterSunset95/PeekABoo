import {
	IonNavLink,
	IonCard,
	IonCardTitle,
	IonImg,
	IonHeader,
	IonContent,
	IonToolbar,
	IonButtons,
	IonBackButton,
	IonTitle,
    IonButton,
    IonPage,
	IonTabs,
	IonTab,
	IonTabBar,
	IonTabButton,
	IonIcon,
	IonInput,
	IonGrid,
	IonCol,
	IonRow,
	IonList,
	IonItem,
	IonAvatar,
	IonText,
	useIonRouter,
	useIonAlert,
	IonChip,
	IonLabel,
	useIonToast,
    IonModal,
    IonSelect,
    IonSelectOption,
	IonSpinner,
} from "@ionic/react"

import './AnimeInfo.css'
import { useContext, useEffect, useRef, useState } from "react"
import { AnimeInfo, MediaInfo, OpenRoom, PlayerOptions, Settings, TvSeason } from "../../lib/types"
import { getEpisodeServers, getEpisodeSources } from "../../lib/anime"
import { Swiper, SwiperSlide } from "swiper/react"

import {
	Pagination
} from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { IAnimeEpisode, IEpisodeServer, ISource, Topics } from "@consumet/extensions"
import PlayerComponent from "../../components/Player"
import { proxyThisLink } from "../../lib/backendconnection"
import { getSettings, resetSettings } from "../../lib/storage"
import LoadingComponent from "../../components/Loading"
import { UserContext } from "../../App"
import { getMovieEmbeds, getMovieSources, getTvEpisodeEmbeds, getTvEpisodeSources, getSimilarMovies, getSimilarTvShows } from "../../lib/movies"
import { play, star, starOutline } from "ionicons/icons"
import "./InfoPage.css"
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore"
import { app } from "../../lib/firebase"
import { Favourite } from "../../lib/models"
import { MovieInfo } from "../../lib/types"
import ListVert from "../../components/ListVert"
import DetailCard from "../../components/DetailCard"

interface InfoProps {
	info: MediaInfo,
}

const InfoPage: React.FC<InfoProps> = ({ info }) => {
	const [season, setSeason] = useState<TvSeason>()
	const [tvEpisode, setTvEpisode] = useState<number>()
	const [episode, setEpisode] = useState<IAnimeEpisode>();
	// Used in ad-free mode
	const [episodeSources, setEpisodeSources] = useState<ISource>();
	// Used in ad mode
	const [server, setServer] = useState<IEpisodeServer>();
	// List of embed links
	const [episodeServers, setEpisodeServers] = useState<IEpisodeServer[]>([]);

	const [playeroptions, setPlayeroptions] = useState<PlayerOptions>();
	const [settings, setSettings] = useState<Settings>()
	const { user } = useContext(UserContext)
	const router = useIonRouter()
	const [isFavorited, setIsFavorited] = useState(false);
	const [isFavoriteLoading, setIsFavoriteLoading] = useState(true);
	const [similarMedia, setSimilarMedia] = useState<MovieInfo[]>([]);
	const [ showAlert ] = useIonAlert()
	const [ showToast ] = useIonToast()
	
	const loadSettings = async () => {
		const res = await getSettings()
		if (res.peek == false) {
			showToast({
				message: "An error occured while loading settings",
				duration: 3000,
				position: "top"
			})
			await resetSettings()
			return
		}
		setSettings(res.boo as Settings)
	}

	const loadEpisodeSources = async () => {
		const choose = async () => {
			if (info.Type == "anime" && episode) return await getEpisodeSources(episode.id)
			else if (info.Type == "tv") {
				if (season && tvEpisode) {
					return await getTvEpisodeSources(info.Id, season.SeasonNumber, tvEpisode)
				} else {
					showToast({
						message: "state: season and state: tvEpisode are unavailable",
						duration: 3000,
						position: "top"
					})
					return await getTvEpisodeSources(info.Id, 1, 1)
				}
			} else return await getMovieSources(info.Id)
		}
		const res = await choose()
		if (res.peek == false || typeof res.boo == "string") {
			showToast({
				message: "Failed to load episode sources. Either change the Server or switch to ads mode (Settings)",
				duration: 3000,
				position: "top"
			})
			return
		}
		setEpisodeSources(res.boo)
		let sources: { src: string, type: string }[] = []
		res.boo.sources.forEach((source) => {
			if (source.url == "") return;

			sources.push({
				src: proxyThisLink(source.url),
				type: source.isM3U8 ? 'application/x-mpegURL' : 'video/mp4'
			})
		})
		const options: PlayerOptions = {
			autoplay: false,
			controls: true,
			responsive: true,
			fluid: true,
			sources: sources
		}
		setPlayeroptions(options)
	}

	const loadEpisodeServers = async () => {
		const choose = async () => {
			if (info.Type == "anime" && episode) return await getEpisodeServers(episode.id)
			else if (info.Type == "tv") {
				if (season && tvEpisode) {
					return await getTvEpisodeEmbeds(info.Id, season.SeasonNumber, tvEpisode)
				} else {
					showToast({
						message: "state: season and state: tvEpisode are unavailable",
						duration: 3000,
						position: "top"
					})
					return await getTvEpisodeEmbeds(info.Id, 1, 1)
				}
			} else return await getMovieEmbeds(info.Id)
		}
		const res = await choose()
		if (res.peek == false || typeof res.boo == "string") {
			showToast({
				message: "Failed to load episode sources. Either change the Server or switch to ads mode (Settings)",
				duration: 3000,
				position: "top"
			})
			showToast({
				message: `Server message: ${res.boo}`,
				duration: 3000,
				position: "top"
			})
			return
		}
		setEpisodeServers(res.boo)
		setServer(res.boo[2])
	}

	const loadEpisodeInfo = async () => {
		if (!settings) {
			return
		};
		if (settings.AnimeType == "ad") {
			await loadEpisodeServers()
			console.log("Loading embed sources")
		} else {
			await loadEpisodeSources()
			console.log("Loading streaming sources")
		}
	}

	useEffect(() => {
		loadSettings()
	}, [])

	useEffect(() => {
		const checkFavoriteStatus = async () => {
			if (!user) {
				setIsFavorited(false);
				setIsFavoriteLoading(false);
				return;
			}
			setIsFavoriteLoading(true);
			const db = getFirestore(app);
			const favRef = doc(db, 'users', user.uid, 'favorites', info.Id);
			const docSnap = await getDoc(favRef);
			setIsFavorited(docSnap.exists());
			setIsFavoriteLoading(false);
		};
		checkFavoriteStatus();

		const loadSimilar = async () => {
			let res;
			if (info.Type === 'movie') {
				res = await getSimilarMovies(info.Id);
			} else if (info.Type === 'tv') {
				res = await getSimilarTvShows(info.Id);
			} else {
				// No similar API for anime yet
				return;
			}
			if (res.peek) {
				setSimilarMedia(res.boo);
			}
		}
		loadSimilar();
	}, [user, info.Id]);

	const handleToggleFavorite = async () => {
		if (!user) {
			router.push(`/login?return=/${info.Type}/${info.Id}`);
			return;
		}
		setIsFavoriteLoading(true);
		const db = getFirestore(app);
		const favRef = doc(db, 'users', user.uid, 'favorites', info.Id);
		
		if (isFavorited) {
			await deleteDoc(favRef);
			setIsFavorited(false);
			showToast({ message: 'Removed from favorites', duration: 2000, position: 'top' });
		} else {
			const favoriteData: Favourite = {
				mediaId: info.Id,
				mediaType: info.Type,
				title: info.Title,
				posterUrl: info.Poster,
				addedAt: Date.now()
			};
			await setDoc(favRef, favoriteData);
			setIsFavorited(true);
			showToast({ message: 'Added to favorites', duration: 2000, position: 'top' });
		}
		setIsFavoriteLoading(false);
	};

	useEffect(() => {
		loadEpisodeInfo()
		loadSettings()
	}, [episode, tvEpisode])

	if (!settings) {
		return (
			<IonPage>
				<IonContent>
					<h1>Loading settings . . .</h1>
				</IonContent>
			</IonPage>
		)
	}

	const PlayerAndBanner = () => {
		if (server) {
			return (
				// If the user selected an episode or pressed "play"
				// On ad mode
				<div>
					<div className="info-iframe-container">
						<iframe 
							src={server.url}
							frameBorder="0"
							allowFullScreen={true}
							className="info-iframe"
						></iframe>
					</div>
				</div>
			)
		}

		if (playeroptions && episodeSources) {
			return (
				// If the user has selected an episode or pressed the play button (for movie pages)
				// Only in adfree mode
				<PlayerComponent {...playeroptions} />
			)
		}

		return (
			// If the user haven't selected anything yet
			<div className="info-img-container">
				<IonImg
					className="info-img"
					src={info.Poster}
				>
				</IonImg>
			</div>
		)
	}

	const Selectors = () => {
		if (info.Type == "anime") {
			return (
				<>
					{settings.AnimeType == "ad" ?
						<IonSelect aria-label="server"
							label="Select Server"
							labelPlacement="floating"
							fill="solid"
							onIonChange={(e) => {
								setServer(e.target.value)
							}}
							value={server}
						>
							{episodeServers.map((item, index) => (
								<IonSelectOption value={item} key={index}>{item.name}</IonSelectOption>
							))}
						</IonSelect>
						: ""
					}
					<IonSelect aria-label="anime-episode"
						label="Episode"
						labelPlacement="floating"
						fill="solid"
						onIonChange={(e) => {
							setSeason(e.target.value)
						}}
					>
						{info.AnimeEpisodes?.map((item, index) => (
							<IonSelectOption value={item} key={index}>{item.number}</IonSelectOption>
						))}
					</IonSelect>
				</>
			)
		} else if (info.Type == "tv") {
			return (
				<>
					{settings.AnimeType == "ad" ?
						<IonSelect aria-label="server"
							label="Server"
							labelPlacement="floating"
							value={server}
							onIonChange={(e) => {
								setServer(e.target.value)
							}}
							disabled={episodeServers.length>0 ? false : true}
							fill="solid"
						>
							{episodeServers.map((item, index) => (
								<IonSelectOption value={item} key={index}>{item.name}</IonSelectOption>
							))}
						</IonSelect>
						: ""
					}
					<IonSelect aria-label="tv-season"
						label="Season"
						labelPlacement="floating"
						fill="solid"
						value={season}
						onIonChange={(e) => {
							setSeason(e.target.value)
						}}
					>
						{info.TvShowSeason?.map((item, index) => (
							<IonSelectOption value={item} key={index}>{item.Name}</IonSelectOption>
						))}
					</IonSelect>
					<IonSelect
						label="Episode"
						labelPlacement="floating"
						fill="solid"
						value={tvEpisode}
						onIonChange={(e) => {
							setTvEpisode(e.target.value)
						}}
						disabled={season ? false : true}
					>
						{Array.from({ length: season ? season.EpisodeCount : 0}, ((_, index) => (
							<IonSelectOption key={index} value={index+1}>Episode {index+1}</IonSelectOption>
						)))}
					</IonSelect>
				</>
			)
		} else {
			if (episodeServers.length < 1) return (
				<IonButton onClick={loadEpisodeInfo}>
					Play
					<IonIcon icon={play}></IonIcon>
				</IonButton>
			); else return (
				<IonSelect aria-label="server"
					label="Server"
					labelPlacement="floating"
					fill="solid"
					onIonChange={(e) => {
						setServer(e.target.value)
					}}
					value={server}
				>
					{episodeServers.map((item, index) => (
						<IonSelectOption value={item} key={index}>{item.name}</IonSelectOption>
					))}
				</IonSelect>
			)
		}
	}
	
	const Details = () => {
		return (
			<div className="info-details-container">
				<div className="info-actions">
					<IonButton onClick={handleToggleFavorite} fill="outline" disabled={isFavoriteLoading}>
						{isFavoriteLoading ? <IonSpinner name="crescent" /> : (
							<>
								<IonIcon slot="start" icon={isFavorited ? star : starOutline} />
								{isFavorited ? 'Favorited' : 'Add to Favorites'}
							</>
						)}
					</IonButton>
				</div>

				<p>{info.Overview}</p>

				{similarMedia.length > 0 && (
					<div className="similar-media-section">
						<h2>Similar Titles</h2>
						<ListVert
							items={similarMedia}
							renderItem={(item) => (
								<DetailCard
									key={item.Id}
									imageUrl={item.Poster}
									title={item.Title}
									linkUrl={`/${item.Type}/${item.Id}`}
									type={item.Type}
									year={item.Year}
									duration={item.Duration}
									overview={item.Overview}
								/>
							)}
						/>
					</div>
				)}
			</div>
		)
	}

	return (
		<IonPage>

			<IonHeader translucent={true}>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton defaultHref="/media" />
					</IonButtons>
					<IonTitle>{info.Title}</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent className="ion-padding">
				<div className="info-top-section">
					<PlayerAndBanner />
					<div className="infopage-selectors">
						<Selectors />
					</div>
				</div>

				<div className="info-bottom-section">
					<Details />
				</div>
			</IonContent>

		</IonPage>
	)
}

export default InfoPage

