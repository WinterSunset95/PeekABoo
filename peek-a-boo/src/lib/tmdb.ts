import { MediaInfo, MovieInfo, MovieSearchResult, PeekABoo, TmdbMovie, TmdbMovieInfo, TmdbSearchResult, TmdbTv, TmdbTvInfo, TvSeason } from "./types";
import { tmdbMovie_to_MovieInfo, tmdbMovie_to_MovieSearchResult, tmdbMovieInfo_to_MediaInfo, tmdbTv_to_MovieInfo, tmdbTv_to_MovieSearchResult, tmdbTvInfo_to_MediaInfo } from "./typeconverter";
//import { vidsrcScrape }  from "../scraper"
import { ISource, IVideo, IEpisodeServer } from "@consumet/extensions"

export class TMDB {
	tmdbApiKey: string;
	appProxy: string;
	movieTrending: string;
	moviePopular: string;
	movieSearch: string;
	movieInfo: (id: string) => string;
	tvTrending: string;
	tvPopular: string;
	tvSearch: string;
	tvInfo: (id: string) => string;
	tvSimilar: (id: string) => string;
	movieSimilar: (id: string) => string;

	constructor(key: string, proxy: string) {
		this.tmdbApiKey = key;
		this.appProxy = proxy;
		this.movieTrending = `${this.appProxy}https://api.themoviedb.org/3/trending/movie/day?api_key=${this.tmdbApiKey}`
		this.moviePopular = `${this.appProxy}https://api.themoviedb.org/3/movie/popular?api_key=${this.tmdbApiKey}`
		this.movieSearch = `${this.appProxy}https://api.themoviedb.org/3/search/movie?api_key=${this.tmdbApiKey}&query=`
		this.movieInfo = (id: string): string => `${this.appProxy}https://api.themoviedb.org/3/movie/${id}?api_key=${this.tmdbApiKey}`;
		this.tvTrending = `${this.appProxy}https://api.themoviedb.org/3/trending/tv/day?api_key=${this.tmdbApiKey}`
		this.tvPopular = `${this.appProxy}https://api.themoviedb.org/3/tv/popular?api_key=${this.tmdbApiKey}`
		this.tvSearch = `${this.appProxy}https://api.themoviedb.org/3/search/tv?api_key=${this.tmdbApiKey}&query=`
		this.tvInfo = (id: string): string => `${this.appProxy}https://api.themoviedb.org/3/tv/${id}?api_key=${this.tmdbApiKey}`;
		this.tvSimilar = (id: string): string => `${this.appProxy}https://api.themoviedb.org/3/tv/${id}/similar?api_key=${this.tmdbApiKey}`
		this.movieSimilar = (id: string): string => `${this.appProxy}https://api.themoviedb.org/3/movie/${id}/similar?api_key=${this.tmdbApiKey}`
	}

	async getTrendingMovies(): Promise<PeekABoo<MovieInfo[]>> {
		const defaultResult: PeekABoo<MovieInfo[]> = {
			peek: false,
			boo: []
		}

		const response = await fetch(this.movieTrending);
		const data = await response.json() as TmdbSearchResult<TmdbMovie>;
		const array: MovieInfo[] = []

		if (data == undefined) return defaultResult;

    const toReturn = tmdbMovie_to_MovieInfo(data);
    return {
      peek: true,
      boo: toReturn
    };
	}

	async getTrendingTv(): Promise<PeekABoo<MovieInfo[]>> {
		const defaultResult: PeekABoo<MovieInfo[]> = {
			peek: false,
			boo: []
		}

		const response = await fetch(this.tvTrending);
		const data = await response.json() as TmdbSearchResult<TmdbTv>;

		if (data == undefined) return defaultResult;

		return {
			peek: true,
			boo: tmdbTv_to_MovieInfo(data)
		}
	}

	async searchMovie(query: string): Promise<PeekABoo<MovieInfo[]>> {
		const defaultResult: PeekABoo<MovieInfo[]> = {
			peek: false,
			boo: []
		}

		console.log(this.movieSearch + query)
		const response = await fetch(`${this.movieSearch}${query}`)
		const data = await response.json() as TmdbSearchResult<TmdbMovie>;

		if (data == undefined) return defaultResult;

		return {
			peek: true,
			boo: tmdbMovie_to_MovieInfo(data)
		};
	}

	async searchTv(query: string): Promise<PeekABoo<MovieInfo[]>> {
		const defaultResult: PeekABoo<MovieInfo[]> = {
			peek: false,
			boo: []
		}

		console.log(this.tvSearch + query)
		const response = await fetch(`${this.tvSearch}${query}`)
		const data = await response.json() as TmdbSearchResult<TmdbTv>;

		if (data == undefined) return defaultResult;

		return {
			peek: true,
			boo: tmdbTv_to_MovieInfo(data)
		};
	}

	async getMovieInfo(id: string): Promise<PeekABoo<MediaInfo | string>> {
		const response = await fetch(`${this.movieInfo(id)}`)
		if (response.status == 400) {
			return {
				peek: false,
				boo: `Failed to get Movie Info ${id}`
			}
		}
		const data = await response.json() as TmdbMovieInfo;
		if (data == undefined) {
			return {
				peek: false,
				boo: `Failed to get Movie Info ${id}`
			}
		}

		return {
			peek: true,
			boo: tmdbMovieInfo_to_MediaInfo(data)
		}
	}

	async getTvInfo(id: string): Promise<PeekABoo<MediaInfo | string>> {
		console.log(`getTvInfo: ${this.tvInfo(id)}`)
		const response = await fetch(`${this.tvInfo(id)}`)
		if (response.status == 400) {
			return {
				peek: false,
				boo: `Failed to get Show ${id}`
			}
		}
		const data = await response.json() as TmdbTvInfo;
		if (data == undefined) {
			return {
				peek: false,
				boo: `Failed to get Show ${id}`
			}
		}
		return {
			peek: true,
			boo: tmdbTvInfo_to_MediaInfo(data)
		}
	}

	async getSimilarTvShows(id: string): Promise<PeekABoo<MovieInfo[]>> {
		const res = await fetch(this.tvSimilar(id), {
			method: "GET",
			headers: {
				accept: "application/json",
				Authorization: `Bearer ${this.tmdbApiKey}`
			}
		})
		if (res.status == 400) {
			return {
				peek: false,
				boo: []
			}
		}
		const data = await res.json() as TmdbSearchResult<TmdbTv>

		return {
			peek: true,
			boo: tmdbTv_to_MovieInfo(data),
		}
	}

	async getSimilarMovies(id: string): Promise<PeekABoo<MovieInfo[]>> {
		const res = await fetch(this.movieSimilar(id), {
			method: "GET",
			headers: {
				accept: "application/json",
				Authorization: `Bearer ${this.tmdbApiKey}`
			}
		})
		if (res.status == 400) {
			return {
				peek: false,
				boo: []
			}
		}
		const data = await res.json() as TmdbSearchResult<TmdbMovie>

		return {
			peek: true,
			boo: tmdbMovie_to_MovieInfo(data),
		}
	}

	//async getMovieSources(id: string): Promise<PeekABoo<ISource | string>> {
	//	try {
	//		const res = await vidsrcScrape(id, "movie")
	//		const sourcesList: IVideo[] = []
	//		res.forEach(item => {
	//			const source: IVideo = {
	//				url: item.stream ?? "",
	//				isM3U8: true
	//			}
	//			sourcesList.push(source)
	//		})

	//		const toReturn: ISource = {
	//			sources: sourcesList,
	//			embedURL: `https://vidsrc.net/embed/movie?tmdb=${id}`
	//		}
	//		
	//		return {
	//			peek: true,
	//			boo: toReturn
	//		}
	//	} catch (e) {
	//		return {
	//			peek: false,
	//			boo: e as string
	//		}
	//	}
	//}

	getMovieEmbeds(id: string): PeekABoo<IEpisodeServer[] | string> {
		try {
			const servers: IEpisodeServer[] = [
				{
					name: "VidSrc Net",
					url: `https://vidsrc.net/embed/movie?tmdb=${id}`
				},
				{
					name: "VidSrc Icu",
					url: `https://vidsrc.icu/embed/movie/${id}`
				},
				{
					name: "Super Embed",
					url: `https://multiembed.mov/?video_id=${id}&tmdb=1`
				},
				{
					name: "VidPro",
					url: `https://vidsrc.pro/embed/movie/${id}`
				},
				{
					name: "VidSrc In",
					url: `https://vidsrc.in/embed/movie/${id}`
				},
				{
					name: "VidSrc VIP",
					url: `https://vidsrc.vip/embed/movie/${id}`
				},
				{
					name: "VidSrc To",
					url: `https://vidsrc.to/embed/movie/${id}`
				}
			]
			return {
				peek: true,
				boo: servers
			}
		} catch (e) {
			return {
				peek: false,
				boo: e as string,
			}
		}
	}

	//async getEpisodeSources(id: string, season: number, episode: number): Promise<PeekABoo<ISource | string>> {
	//	console.log(id, season, episode)
	//	try {
	//		const res = await vidsrcScrape(id, "tv", season, episode)

	//		const sourcesList: IVideo[] = []
	//		res.forEach(item => {
	//			const source: IVideo = {
	//				url: item.stream ?? "",
	//				isM3U8: true
	//			}
	//			sourcesList.push(source)
	//		})

	//		const toReturn: ISource = {
	//			sources: sourcesList,
	//			embedURL: `https://vidsrc.net/embed/movie?tmdb=${id}`
	//		}
	//		
	//		return {
	//			peek: true,
	//			boo: toReturn
	//		}
	//	} catch (e) {
	//		console.log(e)
	//		return {
	//			peek: false,
	//			boo: "Couldn't get the sources!"
	//		}
	//	}
	//}

	getTvEmbeds(id: string, season: number, episode: number): PeekABoo<IEpisodeServer[] | string> {
		const serversList: IEpisodeServer[] = [
			{
				name: "VidSrc Net",
				url: `https://vidsrc.net/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`
			},
			{
				name: "VidSrc Icu",
				url: `https://vidsrc.icu/embed/tv/${id}/${season}/${episode}`
			},
			{
				name: "Super Embed",
				url: `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`
			},
			{
				name: "VidPro",
				url: `https://vidsrc.pro/embed/tv/${id}/${season}/${episode}`
			},
			{
				name: "VidSrc In",
				url: `https://vidsrc.in/embed/tv/${id}/${season}/${episode}`
			},
			{
				name: "VidSrc VIP",
				url: `https://vidsrc.vip/embed/tv/${id}/${season}/${episode}`
			},
			{
				name: "VidSrc To",
				url: `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`
			}
		]
		return {
			peek: true,
			boo: serversList,
		}
	}
}
