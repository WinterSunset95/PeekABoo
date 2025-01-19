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

export interface PlayerOptions {
	autoplay: boolean,
	controls: boolean,
	responsive: boolean,
	fluid: boolean,
	sources: { src: string, type: string }[]
}

export interface PeekABoo<T> {
	peek: Boolean;
	boo: T;
}

export type AnimeTypeOptions = "ad" | "adfree" 
export type AnimeSourceOptions = "gogo" | "nineanime" | "animepahe" | "zoro" | "animefox" | "animedrive" | "anify" | "crunchyroll" | "bilibili" | "marin" | "animesaturn" | "animeunity" | "monoschinos";
export type MovieSourceoptions = "dramacool" | "flixhq" | "fmovies" | "goku" | "kissasian" | "moviehdwatch" | "smashystream" | "turkish" | "viewasian" | "tmdb";
export type ServerOptions = "http://localhost:3000" | "http://65.1.92.65";

export interface Settings {
	AnimeType: "ad" | "adfree",
	AnimeSource: "gogo" | "nineanime" | "animepahe" | "zoro" | "animefox" | "animedrive" | "anify" | "crunchyroll" | "bilibili" | "marin" | "animesaturn" | "animeunity" | "monoschinos",
	MovieSource: "dramacool" | "flixhq" | "fmovies" | "goku" | "kissasian" | "moviehdwatch" | "smashystream" | "turkish" | "viewasian" | "tmdb",
	Server: "http://localhost:3000" | "http://65.1.92.65"
}

export const SettingsAnimeTypes: AnimeTypeOptions[] = ["ad", "adfree"]
export const SettingsAnimeSources: AnimeSourceOptions[] = ["gogo" , "nineanime" , "animepahe" , "zoro" , "animefox" , "animedrive" , "anify" , "crunchyroll" , "bilibili" , "marin" , "animesaturn" , "animeunity" , "monoschinos"]
export const SettingsMovieSources: MovieSourceoptions[] = [ "dramacool" , "flixhq" , "fmovies" , "goku" , "kissasian" , "moviehdwatch" , "smashystream" , "turkish" , "viewasian", "tmdb"]
export const SettingsServers: ServerOptions[] = [ "http://localhost:3000", "http://65.1.92.65" ]
