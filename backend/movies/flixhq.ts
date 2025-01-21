import { MOVIES } from "@consumet/extensions";
import { MovieSearchResult, PeekABoo } from "../types.ts";
import { ITitle } from "@consumet/extensions";

const movie = new MOVIES.Goku()

export class FlixHq {

	async getTrendingMovies(): Promise<PeekABoo<MovieSearchResult[]>> {
		const defaultResult: PeekABoo<MovieSearchResult[]> = {
			peek: false,
			boo: []
		}

		const res = await movie.fetchTrendingMovies()
		const list: MovieSearchResult[] = []
		res.forEach(movie => {
			const item: MovieSearchResult = {
				Id: movie.id,
				Title: movie.title as string,
				Poster: movie.image as string,
				Type: "movie"
			}
			list.push(item)
		})

		return defaultResult
	}
}
