import { Link, useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { MediaInfo, PlayerOptions, Settings, TvSeason, MovieInfo } from "../../lib/types"
import { getEpisodeServers, getEpisodeSources } from "../../lib/anime"
import 'swiper/css'
import 'swiper/css/pagination'
import { IAnimeEpisode, IEpisodeServer, ISource } from "@consumet/extensions"
import PlayerComponent from "../../components/Player"
import { proxyThisLink } from "../../lib/backendconnection"
import { getSettings, resetSettings } from "../../lib/storage"
import { UserContext } from "../../App"
import { getMovieEmbeds, getMovieSources, getTvEpisodeEmbeds, getTvEpisodeSources, getSimilarMovies, getSimilarTvShows } from "../../lib/movies"
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore"
import { app } from "../../lib/firebase"
import { Favourite } from "../../lib/models"
import ListVert from "../../components/ListVert"
import DetailCard from "../../components/DetailCard"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ArrowLeft, Play, Star, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface InfoProps {
	info: MediaInfo,
}

function InfoPage({ info }: InfoProps) {
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
	const navigate = useNavigate()
	const [isFavorited, setIsFavorited] = useState(false);
	const [isFavoriteLoading, setIsFavoriteLoading] = useState(true);
	const [similarMedia, setSimilarMedia] = useState<MovieInfo[]>([]);
	
	const loadSettings = async () => {
		const res = await getSettings()
		if (res.peek == false) {
			toast.error("An error occurred while loading settings")
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
					toast.warning("state: season and state: tvEpisode are unavailable")
					return await getTvEpisodeSources(info.Id, 1, 1)
				}
			} else return await getMovieSources(info.Id)
		}
		const res = await choose()
		if (res.peek == false || typeof res.boo == "string") {
			toast.error("Failed to load episode sources. Either change the Server or switch to ads mode (Settings)")
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
					toast.warning("state: season and state: tvEpisode are unavailable")
					return await getTvEpisodeEmbeds(info.Id, 1, 1)
				}
			} else return await getMovieEmbeds(info.Id)
		}
		const res = await choose()
		if (res.peek == false || typeof res.boo == "string") {
			toast.error("Failed to load episode sources. Either change the Server or switch to ads mode (Settings)")
			toast.error(`Server message: ${res.boo}`)
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
			navigate(`/login?return=/${info.Type}/${info.Id}`);
			return;
		}
		setIsFavoriteLoading(true);
		const db = getFirestore(app);
		const favRef = doc(db, 'users', user.uid, 'favorites', info.Id);
		
		if (isFavorited) {
			await deleteDoc(favRef);
			setIsFavorited(false);
			toast.success('Removed from favorites');
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
			toast.success('Added to favorites');
		}
		setIsFavoriteLoading(false);
	};

	useEffect(() => {
		loadEpisodeInfo()
		loadSettings()
	}, [episode, tvEpisode])

	if (!settings) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader2 className="h-8 w-8 animate-spin" />
				<p className="ml-2">Loading settings...</p>
			</div>
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
			<div className="aspect-video bg-black">
				<img
					className="w-full h-full object-contain"
					src={info.Poster}
					alt={`Poster for ${info.Title}`}
				/>
			</div>
		)
	}

	const Selectors = () => {
		if (info.Type == "anime") {
			return (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{settings.AnimeType == "ad" && (
						<Select onValueChange={(val) => setServer(episodeServers.find(s => s.name === val))} value={server?.name}>
							<SelectTrigger><SelectValue placeholder="Select Server" /></SelectTrigger>
							<SelectContent>
								{episodeServers.map((item) => (
									<SelectItem value={item.name} key={item.name}>{item.name}</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
					<Select onValueChange={(val) => setEpisode(info.AnimeEpisodes?.find(e => e.id === val))}>
						<SelectTrigger><SelectValue placeholder="Select Episode" /></SelectTrigger>
						<SelectContent>
							{info.AnimeEpisodes?.map((item) => (
								<SelectItem value={item.id} key={item.id}>Episode {item.number}</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			)
		} else if (info.Type == "tv") {
			return (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{settings.AnimeType == "ad" && (
						<Select onValueChange={(val) => setServer(episodeServers.find(s => s.name === val))} value={server?.name} disabled={episodeServers.length === 0}>
							<SelectTrigger><SelectValue placeholder="Select Server" /></SelectTrigger>
							<SelectContent>
								{episodeServers.map((item) => (
									<SelectItem value={item.name} key={item.name}>{item.name}</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
					<Select onValueChange={(val) => setSeason(info.TvShowSeason?.find(s => s.Name === val))} value={season?.Name}>
						<SelectTrigger><SelectValue placeholder="Select Season" /></SelectTrigger>
						<SelectContent>
							{info.TvShowSeason?.map((item) => (
								<SelectItem value={item.Name} key={item.Name}>{item.Name}</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select onValueChange={(val) => setTvEpisode(Number(val))} value={tvEpisode?.toString()} disabled={!season}>
						<SelectTrigger><SelectValue placeholder="Select Episode" /></SelectTrigger>
						<SelectContent>
							{Array.from({ length: season ? season.EpisodeCount : 0 }, (_, index) => (
								<SelectItem value={(index + 1).toString()} key={index}>Episode {index + 1}</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			)
		} else { // Movie
			if (episodeServers.length < 1) return (
				<Button onClick={loadEpisodeInfo}>
					<Play className="mr-2 h-4 w-4" /> Play
				</Button>
			); else return (
				<Select onValueChange={(val) => setServer(episodeServers.find(s => s.name === val))} value={server?.name}>
					<SelectTrigger className="w-full md:w-1/3"><SelectValue placeholder="Select Server" /></SelectTrigger>
					<SelectContent>
						{episodeServers.map((item) => (
							<SelectItem value={item.name} key={item.name}>{item.name}</SelectItem>
						))}
					</SelectContent>
				</Select>
			)
		}
	}
	
	const Details = () => {
		return (
			<div className="space-y-4">
				<div>
					<Button onClick={handleToggleFavorite} variant="outline" disabled={isFavoriteLoading}>
						{isFavoriteLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
							<Star className={cn("mr-2 h-4 w-4", isFavorited && "fill-current text-yellow-400")} />
						)}
						{isFavorited ? 'Favorited' : 'Add to Favorites'}
					</Button>
				</div>

				<p className="text-muted-foreground">{info.Overview}</p>

				{similarMedia.length > 0 && (
					<div>
						<h2 className="text-2xl font-bold mb-4">Similar Titles</h2>
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
		<>
			<header className="flex items-center p-2 border-b bg-background sticky top-0 z-10">
				<Link to="/media">
					<Button variant="ghost" size="icon">
						<ArrowLeft />
					</Button>
				</Link>
				<h1 className="text-lg font-bold truncate ml-2">{info.Title}</h1>
			</header>

			<main className="p-4">
				<div className="space-y-6">
					<PlayerAndBanner />
					<div className="p-4 bg-muted rounded-lg">
						<Selectors />
					</div>
				</div>

				<div className="mt-6">
					<Details />
				</div>
			</main>
		</>
	)
}

export default InfoPage

