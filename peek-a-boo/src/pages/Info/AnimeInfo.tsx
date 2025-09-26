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
} from "@ionic/react"

import './AnimeInfo.css'
import { useContext, useEffect, useState } from "react"
import { AnimeInfo, OpenRoom, PlayerOptions, Settings } from "../../lib/types"
import { getAnimeInfo, getEpisodeServers, getEpisodeSources } from "../../lib/anime"
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

interface InfoProps {
	info: AnimeInfo,
	openRoom?: OpenRoom
}

const AnimeInfoPage: React.FC<InfoProps> = ({ info, openRoom }) => {

	const [episode, setEpisode] = useState<IAnimeEpisode>();
	const [episodeSources, setEpisodeSources] = useState<ISource>();
	const [episodeServers, setEpisodeServers] = useState<IEpisodeServer[]>([]);
	const [server, setServer] = useState<IEpisodeServer>();
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
			alert("An error occured while loading settings")
			await resetSettings()
			return
		}
		setSettings(res.boo as Settings)
	}

	const loadEpisodeSources = async () => {
		if (!episode) return;
		const res = await getEpisodeSources(episode.id)
		if (res.peek == false) {
			alert("Failed to load episode sources. Either change the Server or switch to ads mode (Settings)")
			return
		}
		setEpisodeSources(res.boo)
		let sources: { src: string, type: string }[] = []
		res.boo?.sources.forEach((source) => {
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
		if (!episode) return;
		const res = await getEpisodeServers(episode.id)
		if (res.peek == false) {
			alert("Failed to load episode servers")
			return
		}
		setEpisodeServers(res.boo)
		setServer(res.boo[2])
	}

	const loadEpisodeInfo = async () => {
		if (!episode || !settings) return;
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
			router.push("/login")
			return
		}

		const { user, setUser, name } = userContext

        let roomId = info.Id
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
		console.log(room)
		const res = await createRoom(room)
		console.log(res)
		if (res.peek == false) {
			showAlert("Failed to create room")
			return
		} else {
			console.log(res)
			router.push(`/room/${res.boo.RoomId}`)
		}
	}

	useEffect(() => {
		loadSettings()
	}, [])

	useEffect(() => {
		loadEpisodeInfo()
		loadSettings()
	}, [episode])

	if (!settings) {
		return (
			<IonPage>
				<IonContent>
					<h1>Loading settings . . .</h1>
				</IonContent>
			</IonPage>
		)
	}
	
	const Details = () => {
		if (!info) return <LoadingComponent choice="card_large" />

		return (
			<div>
				<p>{info.Overview}</p>
				<IonButton onClick={roomCreate}>
					Create Room
				</IonButton>
			</div>
		)
	}

	return (
		<IonPage>

			<IonHeader
					translucent={true}
				>
					<IonToolbar
						style={{
							paddingRight: "1rem"
						}}
					>
						<IonTitle>Peek-A-Boo</IonTitle>
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

				<div className="info-content">

					<div className="info-content-half"
					style={{
						maxHeight: `${topH}%`
					}}
					>

							{episode && playeroptions && episodeSources ?

							<PlayerComponent {...playeroptions} />

							: episode && server ?

							<div>
								<div className="info-iframe-container">
									<iframe 
										src={server.url}
										frameBorder="0"
										allowFullScreen={true}
										className="info-iframe"
									></iframe>
								</div>
								<h4>{episodeServers.length} servers</h4>
								<Swiper
									modules={[Pagination]}
									spaceBetween={5}
									slidesPerView={2}
								>
									{episodeServers.map((item, index) => (
									<SwiperSlide 
										key={index}
									>
										<IonButton
											className={`episode-button`}
											color={server?.name == item.name ? "warning" : "primary"}
											onClick={() => {
												setServer(item)
											}}
										>
											{item.name}
										</IonButton>
									</SwiperSlide>
									))}
								</Swiper>
							</div>

							: !episode ?

							<div className="info-img-container">
								<IonImg
									className="info-img"
									src={info.Poster}
								>
								</IonImg>
							</div>

							:

							<div className="loading-component">
								<div className="spinner"></div>
							</div>

							}


						<div className="ion-padding">
							<h4>{info.Episodes.length} Episodes</h4>
							<Swiper
								modules={[Pagination]}
								spaceBetween={5}
								slidesPerView={5}
							>
								{info.Episodes.map((item, index) => (
									<SwiperSlide 
										key={index}
									>
										<IonButton
											className={`episode-button`}
											color={episode?.number == index+1 ? "warning" : "primary"}
											onClick={() => {
												setEpisode(item)
											}}
										>
											{item.number}
										</IonButton>
										<div>{item.description}</div>
									</SwiperSlide>
								))}
							</Swiper>
						</div>

					</div>

					<div className="info-content-half"
					style={{
						overflow: "scroll"
					}} >

						{openRoom ? <Room {...openRoom} /> : <Details />}

					</div>

				</div>
			</IonContent>

		</IonPage>
	)
}

export default AnimeInfoPage
