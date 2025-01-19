import { ANIME, ISource } from "npm:@consumet/extensions"
import { MovieSearchResult, PeekABoo } from "./types.ts";
const anime = new ANIME.Gogoanime();

export const getTrendingAnime = async (): Promise<PeekABoo<MovieSearchResult[]>> => {
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

export const getEpisodeInfo = async (id: string): Promise<PeekABoo<ISource | undefined>> => {
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

