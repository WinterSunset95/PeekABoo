import { IAnimeEpisode } from "@consumet/extensions";

export const appVersion = "1.0.5"

export const mediaTypes = [ "anime", "movie", "tv", "unknown" ] as const
export type MediaTypes = typeof mediaTypes[number]

export interface MovieSearchResult {
	Id: string;
	Title: string;
	Poster: string;
	Type: MediaTypes
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
	Overview: string
	SeasonNumber: number
}

export interface TvInfo extends MovieInfo {
	Season: TvSeason[]
}

export interface MediaInfo extends MovieInfo {
	AnimeEpisodes?: IAnimeEpisode[],
	TvShowSeason?: TvSeason[],
}

export interface PlayerOptions {
	autoplay: boolean,
	controls: boolean,
	responsive: boolean,
	fluid: boolean,
	sources: { src: string, type: string }[]
}

export interface User {
	UserId: string,
	UserName: string,
	UserImage: string
}

export interface RoomCreate extends User {
	MediaId: string,
}

export interface OpenRoom extends User {
	RoomId: string,
	RoomName: string,
	Participants: User[],
	CurrentMedia?: MovieSearchResult,
	Messages: ChatMessage[]
}

export interface ActiveAnimeRoom extends OpenRoom {
	EpisodeId: string,
	Playing: boolean,
	TimeStamp: number
}

export interface ChatMessage extends User {
	MessageType: "text" | "sticker" | "media",
	Message: string
}

export interface RoomMessage<T> {
	RoomId: string,
	SenderId: string,
	Payload: T
}

// When user requests to join a room
// Should recieve OpenRoom as result
export interface RoomRequest {
	RoomId: string,
	RequesterId: string,
}

export interface Release {
	Version: string,
	Apk: string,
	ChangeLogs: string
}

export interface PeekABoo<T> {
	peek: Boolean;
	boo: T;
}

export type AnimeTypeOptions = "ad" | "adfree" 
export type AnimeSourceOptions = "gogo" | "nineanime" | "animepahe" | "zoro" | "animefox" | "animedrive" | "anify" | "crunchyroll" | "bilibili" | "marin" | "animesaturn" | "animeunity" | "monoschinos";
export type MovieSourceoptions = "dramacool" | "flixhq" | "fmovies" | "goku" | "kissasian" | "moviehdwatch" | "smashystream" | "turkish" | "viewasian" | "tmdb";
export type ServerOptions = "http://localhost:3000" | "http://65.1.92.65" | "http://192.168.101.62:3000" | "http://192.168.220.210:3000" | "" | string;

export interface Settings {
	AnimeType: AnimeTypeOptions,
	AnimeSource: AnimeSourceOptions,
	MovieSource: MovieSourceoptions,
	Server: ServerOptions
}

export const SettingsAnimeTypes: AnimeTypeOptions[] = ["ad", "adfree"]
export const SettingsAnimeSources: AnimeSourceOptions[] = ["gogo" , "nineanime" , "animepahe" , "zoro" , "animefox" , "animedrive" , "anify" , "crunchyroll" , "bilibili" , "marin" , "animesaturn" , "animeunity" , "monoschinos"]
export const SettingsMovieSources: MovieSourceoptions[] = [ "dramacool" , "flixhq" , "fmovies" , "goku" , "kissasian" , "moviehdwatch" , "smashystream" , "turkish" , "viewasian", "tmdb"]
export let SettingsServers: ServerOptions[] = [ "http://localhost:3000", "http://65.1.92.65", "http://192.168.101.62:3000", "http://192.168.220.210:3000", "" ]
