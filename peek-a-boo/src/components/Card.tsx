import { Link } from "react-router-dom";
import { MovieInfo } from "../lib/types"

function Card(item: MovieInfo) {
	return (
		<Link
			to={item.Type == "anime" ? `/anime/${item.Id}` : item.Type == "movie" ? `/movie/${item.Id}` : `/tv/${item.Id}`}
			className="aspect-[2/3] block"
		>
			<div className="group relative w-full h-full bg-background shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
				<img
					className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
					src={item.Poster}
					alt={`Poster for ${item.Title}`}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
				<div className="absolute bottom-0 left-0 right-0 p-4">
					<h3 className="text-white text-lg font-bold truncate">
						{item.Title}
					</h3>
				</div>
			</div>
		</Link>
	)
}

export default Card
