import { MOVIES } from "@consumet/extensions";
import { 
	PeekABoo, 
	MovieSearchResult, 
	MovieInfo,
    TvInfo
} from './types'
import { getSettings } from "./storage";

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

export const getMovieInfo = async (query: string): Promise<PeekABoo<MovieInfo>> => {
	const { boo } = await getSettings()
	const settings = boo
	const res = await fetch(`${settings.Server}/movie/${settings.MovieSource}/${query}/info`)
	const data = await res.json() as PeekABoo<MovieInfo>
	return data
}

export const getTrendingTv = async (): Promise<PeekABoo<MovieSearchResult[]>> => {
	const { boo } = await getSettings()
	const settings = boo
	const res = await fetch(`${settings.Server}/tv/${settings.MovieSource}/trending`)
	const data = await res.json() as PeekABoo<MovieSearchResult[]>
	return data
}

export const searchTv = async (query: string): Promise<PeekABoo<MovieSearchResult[]>> => {
	const { boo } = await getSettings()
	const settings = boo
	const res = await fetch(`${settings.Server}/tv/${settings.MovieSource}/search/${query}`)
	const data = await res.json() as PeekABoo<MovieSearchResult[]>
	return data
}

export const getTvInfo = async (query: string): Promise<PeekABoo<TvInfo>> => {
	const { boo } = await getSettings()
	const settings = boo
	const res = await fetch(`${settings.Server}/tv/${settings.MovieSource}/${query}/info`)
	const data = await res.json() as PeekABoo<TvInfo>
	return data
}

export const movieSources = [ "vidsrc", "vidpro", "vidvip", "vidin", "superembed" ] as const

export type MovieSources = typeof movieSources[number]

export const movieEmbedLink = (source: MovieSources, id: string): string => {
	switch (source) {
		case "vidsrc":
			return `https://vidsrc.icu/embed/movie/${id}`
		case "vidpro":
			return `https://vidsrc.pro/embed/movie/${id}`
		case "vidin":
			return `https://vidsrc.in/embed/movie/${id}`
		case "vidvip":
			return `https://vidsrc.vip/embed/movie/${id}`
		case "superembed":
			return `https://multiembed.mov/?video_id=${id}&tmdb=1`
		default:
			return `https://vidsrc.in/embed/movie/${id}`
	}
}

export const tvEmbedLink = (source: MovieSources, id: string, season: number, episode: number): string => {
	switch (source) {
		case "vidsrc":
			return `https://vidsrc.icu/embed/tv/${id}/${season}/${episode}`
		case "vidpro":
			return `https://vidsrc.pro/embed/tv/${id}/${season}/${episode}`
		case "vidin":
			return `https://vidsrc.in/embed/tv/${id}/${season}/${episode}`
		case "vidvip":
			return `https://vidsrc.vip/embed/tv/${id}/${season}/${episode}`
		case "superembed":
			return `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`
		default:
			return `https://vidsrc.in/embed/movie/${id}`
	}
}
