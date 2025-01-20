import { MovieSearchResult, PeekABoo } from "./types.ts";

const tmdbApiKey = Deno.env.get("TMDB_API_KEY");

//const appProxy = "https://api.allorigins.win/get?url=";
const appProxy = "http://65.1.92.65/proxy?url="

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
	let array: MovieSearchResult[] = []

	if (data == undefined) return defaultResult;

	data.results.forEach((item: any) => {
		const arrItem: MovieSearchResult = {
			Id: item.id,
			Title: item.original_title as string,
			Poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
			Type: "movie"
		}
		array.push(arrItem)
	})

	return {
		peek: true,
		boo: array
	}
}
