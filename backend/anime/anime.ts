import { Gogo } from "./gogo.ts";

export const providers = {
	gogo: new Gogo
}

export type ProviderKey = keyof typeof providers;

