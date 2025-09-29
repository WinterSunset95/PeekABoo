import { IAnimeInfo, IAnimeResult, ISearch } from "@consumet/extensions";
import { MediaInfo, MovieInfo, MovieSearchResult, TmdbMovie, TmdbMovieInfo, TmdbSearchResult, TmdbTv, TmdbTvInfo, TvSeason } from "./types";

////////////////////////////////////////////////////////////
// Convert ISearch<IAnimeResult> into MovieSearchResult[] //
////////////////////////////////////////////////////////////
export const animeSearchResult_to_MovieSearchResult = (input: ISearch<IAnimeResult>): MovieSearchResult[] => {
	const list: MovieSearchResult[] = [];
	input.results.forEach((item) => {
		list.push({
			Id: item.id,
			Title: item.title as string,
			Poster: item.image as string,
			Type: "anime",
			IAnimeResult: item
		})
	})
	return list
}

export const tmdbTv_to_MovieSearchResult = (input: TmdbSearchResult<TmdbTv>): MovieSearchResult[] => {
	const list: MovieSearchResult[] = [];
	input.results.forEach((item) => {
		list.push({
			Id: item.id.toString(),
			Title: item.original_name,
			Poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
			Type: "tv",
			TmdbTv: item
		})
	})

	return list
}

export const tmdbMovie_to_MovieSearchResult = (input: TmdbSearchResult<TmdbMovie>): MovieSearchResult[] => {
	const list: MovieSearchResult[] = [];
	input.results.forEach((item) => {
		list.push({
			Id: item.id.toString(),
			Title: item.original_title,
			Poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
			Type: "movie",
			TmdbMovie: item
		})
	})

	return list
}

export const tmdbMovie_to_MovieInfo = (input: TmdbSearchResult<TmdbMovie>): MovieInfo[] => {
  const list: MovieInfo[] = [];
  input.results.forEach((item: TmdbMovie) => {
    list.push({
      Id: item.id.toString(),
      Title: item.original_title,
      Poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
      Type: "movie",
      Overview: item.overview,
      Year: item.release_date,
      Duration: "",
      Genres: [],
      Languages: [],
    })
  })
  return list;
}

export const tmdbTv_to_MovieInfo = (input: TmdbSearchResult<TmdbTv>): MovieInfo[] => {
  const list: MovieInfo[] = [];
  input.results.forEach((item: TmdbTv) => {
    list.push({
      Id: item.id.toString(),
      Title: item.name,
      Poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
      Type: "tv",
      Overview: item.overview,
      Year: item.first_air_date,
      Duration: "",
      Genres: [],
      Languages: [],
    })
  })
  return list;
}

export const tmdbMovieInfo_to_MediaInfo = (input: TmdbMovieInfo): MediaInfo => {
	const data = input
	return {
		Id: data.id.toString(),
		Title: data.original_title,
		Poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
		Type: "movie",
		Overview: data.overview,
		Year: data.release_date,
		Duration: data.runtime.toString(),
		Genres: [],
		Languages: [],
		TmdbMovieInfo: data
	}
}

export const tmdbTvInfo_to_MediaInfo = (input: TmdbTvInfo): MediaInfo => {
	const data = input
	const seasons: TvSeason[] = []
	const seasonsList = data.seasons
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
		Id: data.id.toString(),
		Title: data.original_name,
		Poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
		Type: "tv",
		Overview: data.overview,
		Year: data.first_air_date,
		Duration: data.number_of_episodes.toString() + " episodes",
		Genres: [],
		Languages: [],
		TvShowSeason: seasons,
		TmdbTvInfo: data
	}
}

export const iAnimeInfo_to_MediaInfo = (input: IAnimeInfo): MediaInfo => {
	const result = input
	return {
		// The "id" field of anime.fetchAnimeInfo always returns the word "category" for some reaosn
		Id: result.id,
		Title: result.title as string,
		Poster: result.image as string,
		Overview: result.description as string,
		Year: result.releaseDate as string,
		Duration: result.totalEpisodes ? result.totalEpisodes + " episodes" : "Unknown",
		Genres: result.genres ? result.genres : [],
		Languages: [],
		Type: "anime",
		AnimeEpisodes: result.episodes ? result.episodes : [],
		ConsumetAnimeInfo: input
	}
}

