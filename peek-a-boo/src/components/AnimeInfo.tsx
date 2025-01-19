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
import { AppSettings } from "../AppContext"

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

	const globalSettingsString = localStorage.getItem("PeekABooSettings") as string
	const globalSettings = JSON.parse(globalSettingsString) as Settings
	const [settings, setSettings] = useState<Settings>(globalSettings)
	
	const loadInfo = async () => {
		const res = await getAnimeInfo(id)
		if (res.peek == false) {
			alert("Failed to laod information")
			return
		}
		setInfo(res.boo)
	}

	const loadEpisodeSources = async () => {
		if (!episode) return;
		const res = await getEpisodeSources(episode.id)
		if (res.peek == false) {
			alert("Failed to load episode sources")
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
		console.log(options)
	}

	const loadEpisodeServers = async () => {
		if (!episode) return;
		const res = await getEpisodeServers(episode.id)
		if (res.peek == false) {
			alert("failed to load episode servers")
			return
		}
		setEpisodeServers(res.boo)
		setServer(res.boo[2])
	}

	const loadEpisodeInfo = async () => {
		if (!episode) return;
		console.log(episode)
		console.log(settings)
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
		const newSettingsString = localStorage.getItem("PeekABooSettings") as string
		const newSettings = JSON.parse(newSettingsString) as Settings
		setSettings(newSettings)
		console.log(settings)
		console.log(settings)
	}, [])

	useEffect(() => {
		loadEpisodeInfo()
		const newSettingsString = localStorage.getItem("PeekABooSettings") as string
		const newSettings = JSON.parse(newSettingsString) as Settings
		setSettings(newSettings)
		console.log(settings)
	}, [episode])

	const Image = () => {
		if (!info) return "Loading . . .";

		if (episode && playeroptions && episodeSources) {
			return (
				<PlayerComponent {...playeroptions} />
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
								onClick={() => setServer(item)}
							>
								{item.name}
							</IonButton>
						</SwiperSlide>
						))}
					</Swiper>
				</div>
			)
		}

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

	const Body = () => {
		if (!info) return "Loading . . ."

		return (
			<div className="ion-padding">
				<Image />
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
								onClick={() => setEpisode(item)}
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
