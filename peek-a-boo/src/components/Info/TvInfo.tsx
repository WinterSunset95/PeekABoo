import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonImg, IonTitle, IonToolbar } from "@ionic/react"
import { getMovieInfo, getTvInfo, movieEmbedLink, movieSources, MovieSources, tvEmbedLink } from "../../lib/movies"
import { useEffect, useRef, useState } from "react"
import { TvInfo, TvSeason } from "../../lib/types"
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react"
import "./MovieInfo.css"

interface InfoProps {
	id: string
}
const TvInfoPage: React.FC<InfoProps> = ({ id }) => {
	const [tvInfo, setTvInfo] = useState<TvInfo>()
	const [source, setSource] = useState<MovieSources | undefined>()
	const [season, setSeason] = useState<TvSeason>()
	const [episode, setEpisode] = useState<number>()
	const [image, setImage] = useState<string>()
	const [overview, setOverview] = useState("")

	const loadInfo = async () => {
		const res = await getTvInfo(id)
		if (res.peek == false) {
			alert("Failed to get movie info")
			return
		}
		setTvInfo(res.boo)
	}

	const PlayerAndImage = () => {
		if (!tvInfo) return <h1>Loading . . .</h1>

		if (!source || !season || !episode) {
			return (
				<div className="info-image-container">
					<IonImg
						className="info-img"
						src={image ? image : tvInfo.Poster}
					></IonImg>
				</div>
			)
		}

		return (
			<iframe 
				src={tvEmbedLink(source, tvInfo.Id, season.SeasonNumber, episode)} 
				frameBorder="0"
				referrerPolicy="origin"
				allowFullScreen={true}
				scrolling="no"
				className="movie-iframe"
			></iframe>
		)
	}

	const Details = () => {
		if (!tvInfo) return <h1>Loading . . .</h1>
		return (
			<div>
				<p>{overview ? overview : tvInfo.Overview}</p>
			</div>
		)
	}

	const Episodes = () => {
		if (!tvInfo) return <h1>Loading . . .</h1>
		if (!season) return <div>Select a season</div>
		return (
			<>
			<h4>{season.EpisodeCount} Episodes</h4>
			<Swiper
				spaceBetween={5}
				slidesPerView={5}
			>
				{Array.from({ length: season.EpisodeCount }, ((_, index) => (
					<SwiperSlide key={index}>
						<IonButton
							className="episode-button"
							color={episode == index+1 ? "warning" : "primary"}
							onClick={() => {
								setEpisode(index+1)
							}}
						>
							{index+1}
						</IonButton>
					</SwiperSlide>
				)))}
			</Swiper>
			</>
		)
	}

	const Selector = () => {
		if (!tvInfo) return <h1>Loading . . .</h1>
		return (
			<>
			<h4>{tvInfo.Season.length} Seasons</h4>
			<Swiper
				spaceBetween={5}
				slidesPerView={3}
			>
				{tvInfo.Season.map((item, index) => (
					<SwiperSlide key={index}>
						<IonButton
							className="episode-button"
							color={season == item ? "warning" : "primary"}
							onClick={() => {
								setSeason(item)
								setImage(item.Poster)
								setOverview(item.Overview)
							}}
						>
							{item.Name}
						</IonButton>
					</SwiperSlide>
				))}
			</Swiper>
			<Episodes />
			</>
		)
	}

	useEffect(() => {
		loadInfo()
	}, [])

	const swiper = useRef<SwiperRef>(null)
	useEffect(() => {
		const swiperRef = swiper.current?.swiper
		if (!swiperRef) return;
		swiperRef.slideTo(2)
	}, [swiper])

	return (
		<>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonBackButton></IonBackButton>
					</IonButtons>
					<IonTitle>Watch</IonTitle>
				</IonToolbar>
			</IonHeader>
			
			<IonContent className="info-content ion-padding">
				<PlayerAndImage />

				<h4>{movieSources.length} Sources</h4>
				<Swiper
					spaceBetween={5}
					slidesPerView={3}
					ref={swiper}
				>
					{movieSources.map((item, index) => (
						<SwiperSlide key={index}>
							<IonButton
								className="episode-button"
								color={source == item ? "warning" : "primary"}
								onClick={() => setSource(item)}
							>
								{item}
							</IonButton>
						</SwiperSlide>
					))}
				</Swiper>

				<Selector />

				<hr />
				<Details />
			</IonContent>
		</>
	)
}

export default TvInfoPage
