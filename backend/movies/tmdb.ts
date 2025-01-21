import { MovieInfo, MovieSearchResult, PeekABoo, TvInfo, TvSeason } from "../types.ts";
import { defaultAnimeInfo, defaultTvInfo } from "../utilities/typeconverter.ts";

export class TMDB {

	tmdbApiKey = Deno.env.get("TMDB_API_KEY");
	appProxy =	Deno.env.get("PROXY");

	movieTrending = `${this.appProxy}https://api.themoviedb.org/3/trending/movie/day?api_key=${this.tmdbApiKey}`
	moviePopular = `${this.appProxy}https://api.themoviedb.org/3/movie/popular?api_key=${this.tmdbApiKey}`
	movieSearch = `${this.appProxy}https://api.themoviedb.org/3/search/movie?api_key=${this.tmdbApiKey}&query=`
	movieInfo = (id: string): string => `${this.appProxy}https://api.themoviedb.org/3/movie/${id}?api_key=${this.tmdbApiKey}`;
	tvTrending = `${this.appProxy}https://api.themoviedb.org/3/trending/tv/day?api_key=${this.tmdbApiKey}`
	tvPopular = `${this.appProxy}https://api.themoviedb.org/3/tv/popular?api_key=${this.tmdbApiKey}`
	tvSearch = `${this.appProxy}https://api.themoviedb.org/3/search/tv?api_key=${this.tmdbApiKey}&query=`
	tvInfo = (id: string): string => `${this.appProxy}https://api.themoviedb.org/3/tv/${id}?api_key=${this.tmdbApiKey}`;

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

	async getTrendingTv(): Promise<PeekABoo<MovieSearchResult[]>> {
		const defaultResult: PeekABoo<MovieSearchResult[]> = {
			peek: false,
			boo: []
		}

		const response = await fetch(this.tvTrending);
		const data = await response.json();
		const array: MovieSearchResult[] = []

		if (data == undefined) return defaultResult;

		data.results.forEach((item: any) => {
			const arrItem: MovieSearchResult = {
				Id: item.id,
				Title: item.original_name as string,
				Poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
				Type: "tv"
			}
			array.push(arrItem)
		})

		return {
			peek: true,
			boo: array
		}
	}

	async searchMovie(query: string): Promise<PeekABoo<MovieSearchResult[]>> {
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

	async searchTv(query: string): Promise<PeekABoo<MovieSearchResult[]>> {
		const defaultResult: PeekABoo<MovieSearchResult[]> = {
			peek: false,
			boo: []
		}

		console.log(this.movieSearch, query)
		const response = await fetch(`${this.tvSearch}${query}`)
		const data = await response.json();
		const array: MovieSearchResult[] = [];

		if (data == undefined) return defaultResult;

		data.results.forEach((item: any) => {
			const arrItem: MovieSearchResult = {
				Id: item.id,
				Title: item.original_name,
				Poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
				Type: "tv"
			}
			array.push(arrItem)
		})

		return {
			peek: true,
			boo: array
		};
	}

	async getMovieInfo(id: string): Promise<PeekABoo<MovieInfo>> {
		const response = await fetch(`${this.movieInfo(id)}`)
		const data = await response.json();
		if (data == undefined) {
			return {
				peek: false,
				boo: defaultAnimeInfo
			}
		}

		return {
			peek: true,
			boo: {
				Id: data.id,
				Title: data.original_title,
				Poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
				Type: "movie",
				Overview: data.overview,
				Year: data.release_date,
				Duration: data.runtime,
				Genres: [],
				Languages: []
			}
		}
	}

	async getTvInfo(id: string): Promise<PeekABoo<TvInfo>> {
		const response = await fetch(`${this.tvInfo(id)}`)
		const data = await response.json();
		if (data == undefined) {
			return {
				peek: false,
				boo: defaultTvInfo
			}
		}

		const seasons: TvSeason[] = []
		const seasonsList = data.seasons
		if (!seasonsList) return {
			peek: false,
			boo: defaultTvInfo
		}
		seasonsList.forEach((item: any) => {
			const season: TvSeason = {
				Id: item.id,
				AirDate: item.air_date,
				EpisodeCount: item.episode_count,
				Name: item.name,
				Overview: item.overview,
				Poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
				SeasonNumber: item.season_number
			}
			seasons.push(season)
		})

		return {
			peek: true,
			boo: {
				Id: data.id,
				Title: data.original_name,
				Poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
				Type: "tv",
				Overview: data.overview,
				Year: data.release_date,
				Duration: data.runtime,
				Genres: [],
				Languages: [],
				Season: seasons
			}
		}
	}
	

}
