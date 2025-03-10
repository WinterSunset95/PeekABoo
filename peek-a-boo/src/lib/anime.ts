/*
 *TODO:
	1. Error handling
	2. Document the functions
	3. Migrate everything (Done)
 */

import { ANIME, IAnimeInfo, IEpisodeServer, ISource } from "@consumet/extensions";
import { MovieSearchResult, PeekABoo, MovieInfo, AnimeInfo, Settings, MediaInfo } from "./types";
import { getSettings, resetSettings } from "./storage";

export const getEpisodeSources = async (id: string): Promise<PeekABoo<ISource | string>> => {
	const { boo } = await getSettings()
	const settings = boo
	const res = await fetch(`${settings.Server}/anime/${boo.AnimeSource}/episode/${id}/sources`);
	let data = await res.json() as PeekABoo<ISource>;
	return data
}

export const getAnimeInfo = async (id: string): Promise<PeekABoo<MediaInfo | string>> => {
	const { boo } = await getSettings()
	const settings = boo
	const res = await fetch(`${settings.Server}/anime/${settings.AnimeSource}/${id}/info`)
	const data = await res.json() as PeekABoo<MediaInfo | string>
	return data
}

export const getEpisodeServers = async (id: string): Promise<PeekABoo<IEpisodeServer[]>> => {
	const { boo } = await getSettings()
	const settings = boo
	const res = await fetch(`${settings.Server}/anime/${settings.AnimeSource}/episode/${id}/servers`)
	const data = await res.json() as PeekABoo<IEpisodeServer[]>
	return data
}

export const getTopAiring = async (): Promise<PeekABoo<AnimeInfo>> => {
	const { boo } = await getSettings()
	const settings = boo
	const res = await fetch(`${settings.Server}/anime/${settings.AnimeSource}/topairing`)
	const data = await res.json() as PeekABoo<AnimeInfo>
	return data
}

export const getTrending = async (): Promise<PeekABoo<MovieSearchResult[]>> => {
	const { boo } = await getSettings()
	const settings = boo
	const res = await fetch(`${settings.Server}/anime/${settings.AnimeSource}/trending`)
	const data = await res.json() as PeekABoo<MovieSearchResult[]>
	return data
}

export const searchAnime = async (query: string): Promise<PeekABoo<MovieSearchResult[]>> => {
	const { boo } = await getSettings()
	const settings = boo
	const res = await fetch(`${settings.Server}/anime/${settings.AnimeSource}/search/${query}`)
	const data = await res.json() as PeekABoo<MovieSearchResult[]>
	return data
}
