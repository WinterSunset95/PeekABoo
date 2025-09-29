import { PeekABoo, Settings, User } from './types'

export const getSettings = async (): Promise<PeekABoo<Settings>> => {

	let value = localStorage.getItem("base_settings")
	if (value == null) {
		const res = await resetSettings()
		value = JSON.stringify(res.boo)
	}
	const settings = JSON.parse(value) as Settings
	return {
		peek: true,
		boo: settings
	}
}

export const resetSettings = async (): Promise<PeekABoo<Settings>> => {
	const settings: Settings = {
		AnimeType: "ad",
		AnimeSource: "gogo",
		MovieSource: "tmdb",
		Server: "http://65.1.92.65"
	};
	localStorage.setItem("base_settings", JSON.stringify(settings))

	const value = localStorage.getItem("base_settings")
	if ( value == null) {
		return {
			peek: false,
			boo: settings
		}
	}
	const toReturn = JSON.parse(value) as Settings
	if (!settings.AnimeType) {
		return {
			peek: false,
			boo: settings
		}
	}
	return {
		peek: true,
		boo: toReturn
	}
}

export const setSettings = async (settings: Settings): Promise<PeekABoo<Settings | string>> => {
	localStorage.setItem("base_settings", JSON.stringify(settings))
	
	const value = localStorage.getItem("base_settings")
	if ( value == null) {
		return {
			peek: false,
			boo: "Error setting settings"
		}
	}
	const toReturn = JSON.parse(value) as Settings
	if (!settings.AnimeType) {
		return {
			peek: false,
			boo: "Error setting settings"
		}
	}
	return {
		peek: true,
		boo: toReturn
	}
}
