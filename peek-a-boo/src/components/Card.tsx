import {
	IonNavLink,
	IonCard,
	IonCardTitle,
	IonImg,
} from "@ionic/react"
import { MovieSearchResult } from "../lib/types"

import AnimeInfoPage from '../pages/Info/AnimeInfo'
import './Card.css'
import MovieInfoPage from "../pages/Info/MovieInfo"
import TvInfoPage from "../pages/Info/TvInfo"
import { Link } from "react-router-dom"

const Card: React.FC<MovieSearchResult> = (item) => {
	return (
		<IonCard
			className="item-card"
			routerLink={item.Type == "anime" ? `/anime/${item.Id}` : item.Type == "movie" ? `/movie/${item.Id}` : `/tv/${item.Id}`}
		>
			<div className="item-card-img-container">
				<IonImg
					className="item-card-img"
					src={item.Poster}
				>
				</IonImg>
				<IonCardTitle className="item-card-title">
					{item.Title}
				</IonCardTitle>
			</div>
		</IonCard>
	)
}

export default Card
