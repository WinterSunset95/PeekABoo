import {
	IonNavLink,
	IonCard,
	IonCardTitle,
	IonImg,
} from "@ionic/react"
import { MovieSearchResult } from "../lib/types"

import AnimeInfoPage from './AnimeInfo'
import './Card.css'

const Card: React.FC<MovieSearchResult> = (item) => {
	return (
		<IonNavLink 
			className="item-card"
			routerDirection="forward"
			component={() => <AnimeInfoPage id={item.Id} />}
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
