import {
	IonNavLink,
	IonCard,
	IonCardTitle,
	IonImg
} from '@ionic/react'
import { MovieInfo, MovieSearchResult } from "../lib/types"

import "./Featured.css"
import AnimeInfoPage from './AnimeInfo'

const Featured: React.FC<MovieInfo> = (item) => {

	return (
		<IonNavLink
			routerDirection="forward"
			component={() => <AnimeInfoPage id={item.Id} />}
		>
			<IonCard>
				<div className="featured-card">
					<IonImg
						className="featured-card-img"
						src={item.Poster}
					>
					</IonImg>
					<div className="featured-card-info">
						<h1>{item.Title}</h1>
						<hr align="left" />
						<p>{item.Overview.length > 80 ? item.Overview.substring(0, 80) + "..." : item.Overview}</p>
					</div>
				</div>
			</IonCard>
		</IonNavLink>
	)
}

export default Featured
