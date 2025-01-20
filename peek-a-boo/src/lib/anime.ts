import { ANIME, IAnimeInfo, IEpisodeServer, ISource } from "@consumet/extensions";
import { MovieSearchResult, PeekABoo, MovieInfo, AnimeInfo, Settings } from "./types";
import { getSettings, resetSettings } from "./storage";

const anime = new ANIME.Gogoanime();

export const getAnimeInfo = async (id: string): Promise<PeekABoo<AnimeInfo>> => {
	let defaultResult: PeekABoo<AnimeInfo> = {
		peek: false,
		boo: {
			Id: "unknown",
			Title: "Not Found",
			Poster: "Not Found",
			Overview: "none",
			Year: "none",
			Duration: "none",
			Genres: [],
			Languages: [],
			Type: "unknown",
			Episodes: []
		}
	}

	let result: IAnimeInfo = await anime.fetchAnimeInfo(id)
	if (!result) return defaultResult;

	return {
		peek: true,
		boo: {
			// The "id" field of anime.fetchAnimeInfo always returns the word "category" for some reaosn
			Id: id,
			Title: result.title as string,
			Poster: result.image as string,
			Overview: result.description as string,
			Year: result.releaseDate as string,
			Duration: result.totalEpisodes ? result.totalEpisodes + " episodes" : "Unknown",
			Genres: result.genres ? result.genres : [],
			Languages: [],
			Type: "anime",
			Episodes: result.episodes ? result.episodes : []
		}
	}
}

export const getEpisodeSources = async (id: string): Promise<PeekABoo<ISource | undefined>> => {
	let defaultRes: PeekABoo<undefined> = {
		peek: false,
		boo: undefined
	}

	const { boo } = await getSettings()

	try {
		const res = await fetch(`${boo.Server}/anime/episode/` + id);
		let data = await res.json() as PeekABoo<ISource>;
		return {
			peek: true,
			boo: data.boo
		}
	} catch (err) {
		return defaultRes
	}
}

export const getEpisodeServers = async (id: string): Promise<PeekABoo<IEpisodeServer[]>> => {
	let defaultRes: PeekABoo<IEpisodeServer[]> = {
		peek: false,
		boo: []
	}

	const res = await anime.fetchEpisodeServers(id)
	if (!res || res.length == 0) return defaultRes;
	console.log(res)

	return {
		peek: true,
		boo: res
	}
}

export const getTopAiring = async (): Promise<PeekABoo<AnimeInfo>> => {
	let defaultResult: PeekABoo<AnimeInfo> = {
		peek: false,
		boo: {
			Id: "unknown",
			Title: "Not Found",
			Poster: "Not Found",
			Overview: "none",
			Year: "none",
			Duration: "none",
			Genres: [],
			Languages: [],
			Type: "unknown",
			Episodes: []
		}
	}

	let result = await anime.fetchTopAiring()
	if (!result || result.totalPages == 0) return defaultResult;
	let top = result.results[0]
	let topInfo = await anime.fetchAnimeInfo(top.id)

	let topAiring: AnimeInfo = {
		// For some reason, the "id" from anime.fetchAnimeInfo always returns "category"
		Id: top.id,
		Title: topInfo.title as string,
		Poster: topInfo.image as string,
		Overview: topInfo.description as string,
		Year: topInfo.releaseDate as string,
		Duration: topInfo.episodes ? topInfo.episodes.length.toString() + " ep" : "Unknown",
		Genres: topInfo.genres ? topInfo.genres : [],
		Languages: [],
		Type: "anime",
		Episodes: topInfo.episodes ? topInfo.episodes : []
	}

	return {
		peek: true,
		boo: topAiring
	}
}

export const getTrending = async (): Promise<PeekABoo<MovieSearchResult[]>> => {
	let defaultResult: PeekABoo<MovieSearchResult[]> = {
		peek: false,
		boo: []
	}

	let result = await anime.fetchPopular();
	if (!result || result.totalPages == 0) return defaultResult;

	let list: MovieSearchResult[] = [];
	result.results.forEach((item) => {
		list.push({
			Id: item.id,
			Title: item.title as string,
			Poster: item.image as string,
			Type: "anime"
		})
	});

	return {
		peek: true,
		boo: list
	};
}

export const searchAnime = async (query: string): Promise<PeekABoo<MovieSearchResult[]>> => {
	let defaultResult: PeekABoo<MovieSearchResult[]> = {
		peek: false,
		boo: []
	}

	let res = await anime.search(query)
	if (!res || res.totalPages == 0) return defaultResult;

	let list: MovieSearchResult[] = []
	res.results.forEach((item) => {
		list.push({
			Id: item.id,
			Title: item.title as string,
			Poster: item.image as string,
			Type: "anime"
		})
	})

	return {
		peek: true,
		boo: list
	}
}
