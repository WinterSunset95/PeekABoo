import { IAnimeEpisode, IAnimeInfo } from "@consumet/extensions";

export const appVersion = "1.0.7"

export const mediaTypes = [ "anime", "movie", "tv", "unknown" ] as const
export type MediaTypes = typeof mediaTypes[number]

export interface MovieSearchResult {
	Id: string;
	Title: string;
	Poster: string;
	Type: MediaTypes;
}

export interface ConsumetAnimeInfo extends IAnimeInfo{}

export interface TmdbMovieInfo {
	adult: boolean,
	backdrop_path: string,
	belongs_to_collection: string,
	budget: number,
	genres: [
		{
			id: number,
			name: string
		},
	],
	homepage: string,
	id: number,
	imdb_id: string,
	original_language: string,
	original_title: string,
	overview: string,
	popularity: number,
	poster_path: string,
	production_companies: [
		{
			id: number,
			logo_path: string,
			name: string,
			origin_country: string
		}
	],
	production_countries: [
		{
			iso_3166_1: string,
			name: string
		}
	],
	release_date: string,
	revenue: number,
	runtime: number,
	spoken_languages: [
		{
			english_name: string,
			iso_639_1: string,
			name: string
		}
	],
	status: string,
	tagline: string,
	title: string,
	video: boolean,
	vote_average: number,
	vote_count: number
}

export interface TmdbTvInfo {
	adult: boolean;
	backdrop_path: string;
	created_by: {
		id: number;
		credit_id: string;
		name: string;
		gender: number;
		profile_path: string;
	}[];
	episode_run_time: number[];
	first_air_date: string;
	genres: {
		id: number;
		name: string;
	}[];
	homepage: string;
	id: number;
	in_production: boolean;
	languages: string[];
	last_air_date: string;
	last_episode_to_air: {
		id: number;
		name: string;
		overview: string;
		vote_average: number;
		vote_count: number;
		air_date: string;
		episode_number: number;
		production_code: string;
		runtime: number;
		season_number: number;
		show_id: number;
		still_path: string;
	};
	name: string;
	next_episode_to_air: null;
	networks: {
		id: number;
		logo_path: string;
		name: string;
		origin_country: string;
	}[];
	number_of_episodes: number;
	number_of_seasons: number;
	origin_country: string[];
	original_language: string;
	original_name: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: {
		id: number;
		logo_path: string | null;
		name: string;
		origin_country: string;
	}[];
	production_countries: {
		iso_3166_1: string;
		name: string;
	}[];
	seasons: {
		air_date: string;
		episode_count: number;
		id: number;
		name: string;
		overview: string;
		poster_path: string;
		season_number: number;
		vote_average: number;
	}[];
	spoken_languages: {
		english_name: string;
		iso_639_1: string;
		name: string;
	}[];
	status: string;
	tagline: string;
	type: string;
	vote_average: number;
	vote_count: number;
}

export interface TmdbTv {
	adult: boolean;
	backdrop_path: string | null;
	genre_ids: number[];
	id: number;
	origin_country: string[];
	original_language: string;
	original_name: string;
	overview: string;
	popularity: number;
	poster_path: string | null;
	first_air_date: string;
	name: string;
	vote_average: number;
	vote_count: number;
}

export interface TmdbMovie {
	adult: boolean;
	backdrop_path: string | null;
	genre_ids: number[];
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string | null;
	release_date: string; // Can be an empty string if unavailable
  title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}

export interface TmdbSearchResult<T> {
	page: number;
	results: T[];
	total_pages: number;
	total_results: number;
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
  TmdbMovieInfo?: TmdbMovieInfo,
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
