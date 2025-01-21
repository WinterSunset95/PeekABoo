import { MOVIES } from "@consumet/extensions";
import { 
	PeekABoo, 
	MovieSearchResult, 
	MovieInfo
} from './types'
import { getSettings } from "./storage";

const movie1 = new MOVIES.FlixHQ();

export const getTrendingMovies = async (): Promise<PeekABoo<MovieSearchResult[]>> => {
	const { boo } = await getSettings()
	const settings = boo
	const res = await fetch(`${settings.Server}/movie/${settings.MovieSource}/trending`)
	const data = await res.json() as PeekABoo<MovieSearchResult[]>
	return data
}

export const searchMovie = async (query: string): Promise<PeekABoo<MovieSearchResult[]>> => {
	const { boo } = await getSettings()
	const settings = boo
	const res = await fetch(`${settings.Server}/movie/${settings.MovieSource}/search/${query}`)
	const data = await res.json() as PeekABoo<MovieSearchResult[]>
	return data
}
