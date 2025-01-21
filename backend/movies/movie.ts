import { TMDB } from "./tmdb.ts"

export const MovieProviders = {
	tmdb: new TMDB,
}

export type MovieProviderKey = keyof typeof MovieProviders;
