import {
	IonNavLink,
	IonCard,
	IonCardTitle,
	IonImg,
} from "@ionic/react"
import { MovieSearchResult } from "../lib/types"

import AnimeInfoPage from './Info/AnimeInfo'
import './Card.css'
import MovieInfoPage from "./Info/MovieInfo"
import TvInfoPage from "./Info/TvInfo"

const Card: React.FC<MovieSearchResult> = (item) => {
	return (
		<IonNavLink 
			className="item-card"
			routerDirection="forward"
			component={() => {
				if (item.Type == "anime") {
					return <AnimeInfoPage id={item.Id} />
				} else if (item.Type == "movie") {
					return <MovieInfoPage id={item.Id} />
				} else {
					return <TvInfoPage id={item.Id} />
				}
			}}
		>
			<IonCard>
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
		</IonNavLink>
	)
}

export default Card
