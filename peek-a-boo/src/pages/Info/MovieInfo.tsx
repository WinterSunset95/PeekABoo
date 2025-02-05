import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonImg, IonTitle, IonToolbar } from "@ionic/react"
import { getMovieInfo, movieEmbedLink, movieSources, MovieSources } from "../../lib/movies"
import { useEffect, useState } from "react"
import { MovieInfo } from "../../lib/types"
import { Swiper, SwiperSlide } from "swiper/react"
import "./MovieInfo.css"
import LoadingComponent from "../../components/Loading"
import { RouteComponentProps } from "react-router"

interface InfoProps extends RouteComponentProps<{
	id: string
}> {}

const MovieInfoPage: React.FC<InfoProps> = ({ match }) => {
	const [movieInfo, setMovieInfo] = useState<MovieInfo>()
	const [source, setSource] = useState<MovieSources | undefined>()

	const loadInfo = async () => {
		const res = await getMovieInfo(match.params.id)
		if (res.peek == false) {
			alert("Failed to get movie info")
			return
		}
		setMovieInfo(res.boo)
	}

	const PlayerAndImage = () => {
		if (!movieInfo) return <LoadingComponent choice="card_large" />

		if (!source) {
			return (
				<div className="info-image-container">
					<IonImg
						className="info-img"
						src={movieInfo.Poster}
					></IonImg>
				</div>
			)
		}

		return (
			<iframe 
				src={movieEmbedLink(source, movieInfo.Id)} 
				frameBorder="0"
				referrerPolicy="origin"
				allowFullScreen={true}
				scrolling="no"
				className="movie-iframe"
			></iframe>
		)
	}

	const Details = () => {
		if (!movieInfo) return <LoadingComponent choice="card_large" />
		return (
			<div>
				<p>{movieInfo.Overview}</p>
			</div>
		)
	}

	useEffect(() => {
		loadInfo()
	}, [])

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

				<hr />
				<Details />
			</IonContent>
		</>
	)
}

export default MovieInfoPage
