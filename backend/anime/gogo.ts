import { ANIME, IAnimeInfo, IEpisodeServer, ISource } from "@consumet/extensions";
import { AnimeInfo, MovieSearchResult, PeekABoo } from "../types.ts";

const anime = new ANIME.Gogoanime();
export class Gogo {
	async getTrending (): Promise<PeekABoo<MovieSearchResult[]>> {
		const defaultResult: PeekABoo<MovieSearchResult[]> = {
			peek: false,
			boo: []
		}

		const result = await anime.fetchPopular();
		if (!result || result.totalPages == 0) return defaultResult;

		const list: MovieSearchResult[] = [];
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
	async getEpisodeSources(id: string): Promise<PeekABoo<ISource | undefined>> {
		const defaultRes: PeekABoo<undefined> = {
			peek: false,
			boo: undefined
		}
		const res: ISource = await anime.fetchEpisodeSources(id)
		if (!res || res.sources.length == 0) return defaultRes;

		return {
			peek: true,
			boo: res
		}
	}
	async getAnimeInfo(id: string): Promise<PeekABoo<AnimeInfo>> {
		const defaultResult: PeekABoo<AnimeInfo> = {
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

		const result: IAnimeInfo = await anime.fetchAnimeInfo(id)
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
	async getEpisodeServers(id: string): Promise<PeekABoo<IEpisodeServer[]>> {
		const defaultRes: PeekABoo<IEpisodeServer[]> = {
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
	async getTopAiring(): Promise<PeekABoo<AnimeInfo>> {
		const defaultResult: PeekABoo<AnimeInfo> = {
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

		const result = await anime.fetchTopAiring()
		if (!result || result.totalPages == 0) return defaultResult;
		const top = result.results[0]
		const topInfo = await anime.fetchAnimeInfo(top.id)

		const topAiring: AnimeInfo = {
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
	async searchAnime(query: string): Promise<PeekABoo<MovieSearchResult[]>> {
		const defaultResult: PeekABoo<MovieSearchResult[]> = {
			peek: false,
			boo: []
		}

		const res = await anime.search(query)
		if (!res || res.totalPages == 0) return defaultResult;

		const list: MovieSearchResult[] = []
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
}

