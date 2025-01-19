import { MovieSearchResult, PeekABoo } from "./types.ts";

const tmdbApiKey = Deno.env.get("TMDB_API_KEY");

const appProxy = "https://api.allorigins.win/get?url=";

const movieTrending = `${appProxy}https://api.themoviedb.org/3/trending/movie/day?api_key=${tmdbApiKey}`
const moviePopular = `${appProxy}https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}`
const movieSearch = `${appProxy}https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}%20query=`
const movieInfo = (id: string): string => `${appProxy}https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbApiKey}`;
const tvTrending = `${appProxy}https://api.themoviedb.org/3/trending/tv/day?api_key=${tmdbApiKey}`
const tvPopular = `${appProxy}https://api.themoviedb.org/3/tv/popular?api_key=${tmdbApiKey}`
const tvSearch = `${appProxy}https://api.themoviedb.org/3/search/tv?api_key=${tmdbApiKey}%20query=`
const tvInfo = (id: string): string => `${appProxy}https://api.themoviedb.org/3/tv/${id}?api_key=${tmdbApiKey}`;
const dramaCoolSearch = "https://consumet-api-dgfy.vercel.app/movies/dramacool/"
const dramaCoolInfo = "https://consumet-api-dgfy.vercel.app/movies/dramacool/info?id="
const dramaCoolEpInfo = (mediaId: string, episodeId: string) => `https://consumet-api-dgfy.vercel.app/movies/dramacool/watch?episodeId=${episodeId}&mediaId=${mediaId}`

export const getTrendingMovies = async (): Promise<PeekABoo<MovieSearchResult[]>> => {
	const defaultResult: PeekABoo<MovieSearchResult[]> = {
		peek: false,
		boo: []
	}

	const response = await fetch(movieTrending);
	const data = await response.json();
	if (!data) return defaultResult;

	return defaultResult
}
