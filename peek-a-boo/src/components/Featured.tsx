import {
	IonNavLink,
	IonCard,
	IonCardTitle,
	IonImg
} from '@ionic/react'
import { MediaInfo, MovieInfo, MovieSearchResult } from "../lib/types"

import "./Featured.css"
import AnimeInfoPage from '../pages/Info/AnimeInfo'
import { Link } from 'react-router-dom'

const Featured: React.FC<MediaInfo> = (item) => {
	return (
		<Link to={`/${item.Type}/${item.Id}`}>
			<IonCard className="featured-card-ion-container">
				<div className="featured-card">
					<IonImg
						className="featured-card-img"
						src={item.Poster}
					>
					</IonImg>
					<div className="featured-card-info">
						<h1>{item.Title}</h1>
						<hr />
						<p>{item.Overview.length > 80 ? item.Overview.substring(0, 80) + "..." : item.Overview}</p>
					</div>
				</div>
			</IonCard>
		</Link>
	)
}

export default Featured
