import { IEpisodeServer, ISource, MOVIES } from "@consumet/extensions";

import { 
	PeekABoo, 
	MovieSearchResult, 
	MovieInfo,
    TvInfo,
    MediaInfo
} from './types'
import { getSettings } from "./storage";

export const getFeaturedMovie = async (): Promise<PeekABoo<MediaInfo | string>> => {
	const res = await getTrendingMovies()
	if (res.boo.length < 1) {
		return {
			peek: false,
			boo: "Failed to get featured movie"
		}
	}

	const index = Math.floor(Math.random() * (res.boo.length))

	const data = await getMovieInfo(res.boo[index] ? res.boo[index].Id : res.boo[0].Id)
	if (data.peek == false || typeof data.boo == "string") {
		return {
			peek: false,
			boo: "Failed to get info for featured movie"
		}
	}

	return {
		peek: true,
		boo: data.boo
	}
}

// getTrendingMovies() returns an array of objects of type MovieSearchResult wrapped by a PeekABoo object
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

export const getMovieInfo = async (query: string): Promise<PeekABoo<MediaInfo | string>> => {
	const { boo } = await getSettings()
	const settings = boo
	const res = await fetch(`${settings.Server}/movie/${settings.MovieSource}/${query}/info`)
	const data = await res.json() as PeekABoo<MediaInfo | string>
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

export const getTvInfo = async (query: string): Promise<PeekABoo<MediaInfo | string>> => {
	const { boo } = await getSettings()
	const settings = boo
	const res = await fetch(`${settings.Server}/tv/${settings.MovieSource}/${query}/info`)
	const data = await res.json() as PeekABoo<MediaInfo | string>
	return data
}

export const getMovieSources = async (id: string): Promise<PeekABoo<ISource | string>> => {
	const { boo } = await getSettings()
	const settings = boo
	const res = await fetch(`${settings.Server}/movie/${boo.MovieSource}/${id}/sources`);
	let data = await res.json() as PeekABoo<ISource | string>;
	return data
}

export const getMovieEmbeds = async (id: string): Promise<PeekABoo<IEpisodeServer[]>> => {
	const { boo } = await getSettings()
	const settings = boo
	const res = await fetch(`${settings.Server}/movie/${settings.MovieSource}/${id}/embed`)
	const data = await res.json() as PeekABoo<IEpisodeServer[]>
	return data
}

export const getTvEpisodeSources = async (id: string, season: number, episode: number): Promise<PeekABoo<ISource | string>> => {
	const { boo } = await getSettings()
	const settings = boo
	const res = await fetch(`${settings.Server}/tv/${boo.MovieSource}/${id}/${season}/${episode}/sources`);
	let data = await res.json() as PeekABoo<ISource | string>;
	return data
}

export const getTvEpisodeEmbeds = async (id: string, season: number, episode: number): Promise<PeekABoo<IEpisodeServer[]>> => {
	const { boo } = await getSettings()
	const settings = boo
	const res = await fetch(`${settings.Server}/tv/${boo.MovieSource}/${id}/${season}/${episode}/embed`)
	const data = await res.json() as PeekABoo<IEpisodeServer[]>
	return data
}


export const movieSources = [ "vidsrc", "vidpro", "vidvip", "vidin", "superembed" ] as const

export type MovieSources = typeof movieSources[number]

// Returns an embed link for a movie. Takes the tmdb id of the movie as argument
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

// Returns an embed link for a tv episode. Takes the tmdb id, season number and episode number as arguments
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
