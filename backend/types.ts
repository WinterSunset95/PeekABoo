import { IAnimeEpisode } from "@consumet/extensions";

export interface MovieSearchResult {
	Id: string;
	Title: string;
	Poster: string;
	Type: "anime" | "movie" | "tv" | "unknown";
}

export interface MovieInfo extends MovieSearchResult {
	Overview: string;
	Year: string;
	Duration: string;
	Genres: string[];
	Languages: string[];
}

export interface AnimeInfo extends MovieInfo {
	Episodes: IAnimeEpisode[]
}

export interface TvSeason {
	AirDate: string,
	EpisodeCount: number,
	Id: number,
	Name: string,
	Poster: string,
	Overview: string,
	SeasonNumber: string
}

export interface TvInfo extends MovieInfo {
	Season: TvSeason[]
}

export interface PeekABoo<T> {
	peek: boolean;
	boo: T;
}
