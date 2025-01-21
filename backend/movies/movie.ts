import { TMDB } from "./tmdb.ts"
import { FlixHq } from "./flixhq.ts";

export const MovieProviders = {
	tmdb: new TMDB,
	flixhq: new FlixHq,
}

export type MovieProviderKey = keyof typeof MovieProviders;
