import { MOVIES } from "@consumet/extensions";
import { 
	PeekABoo, 
	MovieSearchResult, 
	MovieInfo
} from './types'

const movie1 = new MOVIES.FlixHQ();

export const searchMovie = async (query: string): Promise<PeekABoo<MovieSearchResult[]>> => {
	let defaultResult: PeekABoo<MovieSearchResult[]> = {
		peek: false,
		boo: []
	}

	let res = await movie1.search(query)
	if (!res || res.totalPages == 0) return defaultResult;
	let list: MovieSearchResult[] = []
	res.results.forEach((item) => {
		list.push({
			Id: item.id,
			Title: item.title as string,
			Poster: item.image as string,
			Type: "movie"
		})
	})

	return {
		peek: true,
		boo: list
	};
}

export const getTrendingMovies = async (): Promise<PeekABoo<MovieSearchResult[]>> => {
	let defaultResult: PeekABoo<MovieSearchResult[]> = {
		peek: false,
		boo: []
	}

	return defaultResult;
}

