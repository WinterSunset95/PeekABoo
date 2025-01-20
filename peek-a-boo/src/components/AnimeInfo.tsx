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
} from "@ionic/react"

import './AnimeInfo.css'
import { useContext, useEffect, useState } from "react"
import { AnimeInfo, PlayerOptions, Settings } from "../lib/types"
import { getAnimeInfo, getEpisodeServers, getEpisodeSources } from "../lib/anime"
import { Swiper, SwiperSlide } from "swiper/react"

import {
	Pagination
} from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { IAnimeEpisode, IEpisodeServer, ISource } from "@consumet/extensions"
import PlayerComponent from "./Player"
import { proxyThisLink } from "../lib/backendconnection"
import { getSettings, resetSettings } from "../lib/storage"
import { play } from "ionicons/icons"

interface InfoProps {
	id: string
}

const AnimeInfoPage: React.FC<InfoProps> = ({ id }) => {
	const [info, setInfo] = useState<AnimeInfo>();
	const [episode, setEpisode] = useState<IAnimeEpisode>();
	const [episodeSources, setEpisodeSources] = useState<ISource>();
	const [episodeServers, setEpisodeServers] = useState<IEpisodeServer[]>([]);
	const [server, setServer] = useState<IEpisodeServer>();
	const [playeroptions, setPlayeroptions] = useState<PlayerOptions>();
	const [loading, setLoading] = useState(false)

	const [settings, setSettings] = useState<Settings>()
	
	const loadInfo = async () => {
		const res = await getAnimeInfo(id)
		if (res.peek == false) {
			alert("Failed to laod information")
			return
		}
		setInfo(res.boo)
	}

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

	useEffect(() => {
		loadInfo()
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

	const BannerAndPlayer = () => {
		if (!info) return "Loading . . .";

		if (episode && playeroptions && episodeSources) {
			return (
				<div>
					<PlayerComponent {...playeroptions} />
				</div>
			)
		}

		if (episode && server) {
			return (
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
			)
		}

		if (!episode) {
			return (
				<div className="info-img-container">
					<IonImg
						className="info-img"
						src={info.Poster}
					>
					</IonImg>
				</div>
			)
		}

		return (
			<div className="loading-component">
				<div className="spinner"></div>
			</div>
		)

	}

	const Body = () => {
		if (!info) return "Loading . . ."

		return (
			<div className="ion-padding">
				<BannerAndPlayer />

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
									setLoading(true)
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
		)
	}

	const Details = () => {
		if (!info) return "Loading . . ."

		return (
			<div>
				<p>{info.Overview}</p>
			</div>
		)
	}

	return (
		<>

			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton></IonBackButton>
					</IonButtons>
					<IonTitle>{info ? info.Title : "Watch"}</IonTitle>
				</IonToolbar>
			</IonHeader>
			
			<IonContent className="info-content ion-padding">
				<Body />
				<hr />
				<Details />
			</IonContent>

		</>
	)
}

export default AnimeInfoPage
