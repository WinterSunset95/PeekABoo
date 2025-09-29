import { IEpisodeServer, ISource, MOVIES } from "@consumet/extensions";
import { TMDB } from "../lib/tmdb";

import {
	PeekABoo,
	MovieSearchResult,
	MovieInfo,
  TvInfo,
  MediaInfo
} from './types'
import { getSettings } from "./storage";

const movieProvider = new TMDB("efe0d01423f29d0dd19e4a7e482b217b", "http://65.1.92.65/proxy?url=")
console.log(movieProvider)

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

export const getSimilarMovies = async (id: string): Promise<PeekABoo<MovieInfo[]>> => {
  return await movieProvider.getSimilarMovies(id);
}

export const getSimilarTvShows = async (id: string): Promise<PeekABoo<MovieInfo[]>> => {
  return await movieProvider.getSimilarTvShows(id);
}

// getTrendingMovies() returns an array of objects of type MovieSearchResult wrapped by a PeekABoo object
export const getTrendingMovies = async (): Promise<PeekABoo<MovieInfo[]>> => {
	return await movieProvider.getTrendingMovies()
}

export const searchMovie = async (query: string): Promise<PeekABoo<MovieInfo[]>> => {
	return await movieProvider.searchMovie(query)
}

export const getMovieInfo = async (query: string): Promise<PeekABoo<string | MediaInfo>> => {
  const data = await movieProvider.getMovieInfo(query)
	return data
}

export const getTrendingTv = async (): Promise<PeekABoo<MovieInfo[]>> => {
	return await movieProvider.getTrendingTv()
}

export const searchTv = async (query: string): Promise<PeekABoo<MovieInfo[]>> => {
	return await movieProvider.searchTv(query)
}

export const getTvInfo = async (query: string): Promise<PeekABoo<MediaInfo | string>> => {
	return await movieProvider.getTvInfo(query)
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
