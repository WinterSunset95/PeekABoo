import { ANIME, IAnimeInfo, IEpisodeServer, ISource } from "@consumet/extensions";
import { AnimeInfo, MovieSearchResult, PeekABoo } from "../types.ts";
import { animeSearchResult_to_MovieSearchResult, defaultAnimeInfo, iAnimeInfo_to_AnimeInfo } from "../utilities/typeconverter.ts";

const anime = new ANIME.Gogoanime();

export class Gogo {

	async getTrending (): Promise<PeekABoo<MovieSearchResult[]>> {
		const defaultResult: PeekABoo<MovieSearchResult[]> = {
			peek: false,
			boo: []
		}

		const result = await anime.fetchPopular();
		if (!result || result.totalPages == 0) return defaultResult;

		const list: MovieSearchResult[] = animeSearchResult_to_MovieSearchResult(result)

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
			boo: defaultAnimeInfo
		}

		try {
			const result: IAnimeInfo = await anime.fetchAnimeInfo(id)
			if (!result) return defaultResult;
			result.id = id

			return {
				peek: true,
				boo: iAnimeInfo_to_AnimeInfo(result)
			}
		} catch (err) {
			console.error(err)
			return {
				peek: false,
				boo: {
					Id: "null",
					Title: "Error",
					Poster: "",
					Type: "unknown",
					Overview: "Failed to fetch Information: " + JSON.stringify(err),
					Year: "",
					Duration: "",
					Genres: [],
					Languages: [],
					Episodes: [],
				}
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
			boo: defaultAnimeInfo
		}

		const result = await anime.fetchTopAiring()
		if (!result || result.totalPages == 0) return defaultResult;
		const top = result.results[0]
		const topInfo = await anime.fetchAnimeInfo(top.id)
		// For some reason, the "id" from anime.fetchAnimeInfo always returns "category"
		topInfo.id = top.id

		return {
			peek: true,
			boo: iAnimeInfo_to_AnimeInfo(topInfo)
		}
	}

	async searchAnime(query: string): Promise<PeekABoo<MovieSearchResult[]>> {
		const defaultResult: PeekABoo<MovieSearchResult[]> = {
			peek: false,
			boo: []
		}

		const res = await anime.search(query)
		if (!res || res.totalPages == 0) return defaultResult;

		const list: MovieSearchResult[] = animeSearchResult_to_MovieSearchResult(res)

		return {
			peek: true,
			boo: list
		}
	}

}

