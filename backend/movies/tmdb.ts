import { MovieSearchResult, PeekABoo } from "../types.ts";

export class TMDB {

	tmdbApiKey = Deno.env.get("TMDB_API_KEY");
	appProxy =	Deno.env.get("PROXY");

	movieTrending = `${this.appProxy}https://api.themoviedb.org/3/trending/movie/day?api_key=${this.tmdbApiKey}`
	moviePopular = `${this.appProxy}https://api.themoviedb.org/3/movie/popular?api_key=${this.tmdbApiKey}`
	movieSearch = `${this.appProxy}https://api.themoviedb.org/3/search/movie?api_key=${this.tmdbApiKey}&query=`
	movieInfo = (id: string): string => `${this.appProxy}https://api.themoviedb.org/3/movie/${id}?api_key=${this.tmdbApiKey}`;
	tvTrending = `${this.appProxy}https://api.themoviedb.org/3/trending/tv/day?api_key=${this.tmdbApiKey}`
	tvPopular = `${this.appProxy}https://api.themoviedb.org/3/tv/popular?api_key=${this.tmdbApiKey}`
	tvSearch = `${this.appProxy}https://api.themoviedb.org/3/search/tv?api_key=${this.tmdbApiKey}%20query=`
	tvInfo = (id: string): string => `${this.appProxy}https://api.themoviedb.org/3/tv/${id}?api_key=${this.tmdbApiKey}`;
	dramaCoolSearch = "https://consumet-api-dgfy.vercel.app/movies/dramacool/"
	dramaCoolInfo = "https://consumet-api-dgfy.vercel.app/movies/dramacool/info?id="
	dramaCoolEpInfo = (mediaId: string, episodeId: string) => `https://consumet-api-dgfy.vercel.app/movies/dramacool/watch?episodeId=${episodeId}&mediaId=${mediaId}`

	async getTrendingMovies(): Promise<PeekABoo<MovieSearchResult[]>> {
		const defaultResult: PeekABoo<MovieSearchResult[]> = {
			peek: false,
			boo: []
		}

		const response = await fetch(this.movieTrending);
		const data = await response.json();
		const array: MovieSearchResult[] = []

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

	async search(query: string): Promise<PeekABoo<MovieSearchResult[]>> {
		const defaultResult: PeekABoo<MovieSearchResult[]> = {
			peek: false,
			boo: []
		}

		console.log(this.movieSearch, query)
		const response = await fetch(`${this.movieSearch}${query}`)
		const data = await response.json();
		const array: MovieSearchResult[] = [];

		if (data == undefined) return defaultResult;

		data.results.forEach((item: any) => {
			const arrItem: MovieSearchResult = {
				Id: item.id,
				Title: item.original_title,
				Poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
				Type: "movie"
			}
			array.push(arrItem)
		})

		return {
			peek: true,
			boo: array
		};
	}

}
