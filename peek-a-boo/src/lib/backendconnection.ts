import { Settings } from "./types"

const settingsStr = localStorage.getItem("PeekABooSettings")
if (settingsStr == null) {
	const settings: Settings = {
		AnimeType: "adfree",
		AnimeSource: "gogo",
		MovieSource: "tmdb",
		Server: "http://65.1.92.65"
	}
	localStorage.setItem("PeekABooSettings", JSON.stringify(settings))
	window.location.reload()
}
const settings = JSON.parse(settingsStr as string) as Settings

export const proxyThisLink = (url: string): string => {
	const toReturn = `${settings.Server}/helpers/m3u8?url=${encodeURIComponent(url)}`
	console.log(toReturn)
	return toReturn
}
