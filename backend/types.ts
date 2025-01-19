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

export interface PeekABoo<T> {
	peek: boolean;
	boo: T;
}
