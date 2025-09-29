import {
	IonNavLink,
	IonCard,
	IonCardTitle,
	IonImg,
} from "@ionic/react"
import { MovieInfo, MovieSearchResult } from "../lib/types"

import './Card.css'

const Card: React.FC<MovieInfo> = (item) => {
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
