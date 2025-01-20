import { Preferences } from '@capacitor/preferences'
import { PeekABoo, Settings } from './types'

export const getSettings = async (): Promise<PeekABoo<Settings>> => {
	let { value } = await Preferences.get({ key : "base_settings" })
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
		AnimeType: "adfree",
		AnimeSource: "gogo",
		MovieSource: "tmdb",
		Server: "http://localhost:3000"
	};
	await Preferences.set({
		key: "base_settings",
		value: JSON.stringify(settings)
	})

	const { value } = await Preferences.get({ key: "base_settings" })
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
	await Preferences.set({
		key: "base_settings",
		value: JSON.stringify(settings)
	})
	
	const { value } = await Preferences.get({ key: "base_settings" })
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
