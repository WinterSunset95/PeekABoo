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
import Room from "../../components/Room"
import { createRoom } from "../../lib/rooms"
import { getMovieEmbeds, getMovieSources, getTvEpisodeEmbeds, getTvEpisodeSources } from "../../lib/movies"
import { play } from "ionicons/icons"
import "./InfoPage.css"

interface InfoProps {
	info: MediaInfo,
	openRoom?: OpenRoom
}

const InfoPage: React.FC<InfoProps> = ({ info, openRoom }) => {

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
	const [topH, setTopH] = useState(50)
	const userContext = useContext(UserContext)
	const router = useIonRouter()
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

	const roomCreate = async () => {
		if (!userContext || !info) return

		if (!userContext.user) {
			router.push(`/login?return=/${info.Type}/${info.Id}`)
			return
		}

		const { user, setUser, name } = userContext

        let roomId = info.Id.toString()
        roomId = roomId.toLowerCase()
        const randomNum = Math.floor(100000 + Math.random() * 900000)
        const randomNum2 = Math.floor(100000 + Math.random() * 900000)
        roomId = roomId + "-" + randomNum.toString() + "-" + randomNum2.toString()

		const room: OpenRoom = {
			...user,
			Participants: [user],
			RoomId: roomId,
			RoomName: info.Title,
			CurrentMedia: {
				Id: info.Id,
				Title: info.Title,
				Poster: info.Poster,
				Type: info.Type
			},
			Messages: []
		}
		const res = await createRoom(room)
		if (res.peek == false) {
			showAlert("Failed to create room")
			return
		} else {
			router.push(`/room/${info.Type}/${res.boo.RoomId}`)
		}
	}

	useEffect(() => {
		loadSettings()
	}, [])

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
			<div>
				<p>{info.Overview}</p>
				<IonButton 
					onClick={roomCreate}
				>
					{userContext?.user ? "Create Room" : "Login first to create room"}
				</IonButton>
			</div>
		)
	}

	return (
		<IonPage>

			<IonHeader translucent={true}>
				<IonToolbar
					style={{
						paddingRight: "1rem"
					}}
				>
					<IonTitle>{info.Title}</IonTitle>
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

			<IonContent className="ion-padding">
				<div className="info-content-half"
					style={openRoom ?{
						maxHeight: `${topH}%`,
						overflow: `scroll`
					}:{}}
				>
					
					<PlayerAndBanner />
					<div className="infopage-selectors">
						<Selectors />
					</div>


				</div>

				<div className="info-content-half"
				style={openRoom ? {
					overflow: `scroll`
				}:{}} >

					{openRoom ? <Room {...openRoom} /> : <Details />}

				</div>
			</IonContent>

		</IonPage>
	)
}

export default InfoPage

