import { getSettings } from "./storage"
import { Release, Settings } from "./types"

const settings = await getSettings()

export const proxyThisLink = (url: string): string => {
	console.log(`Initial url: ${url}`)
	const toReturn = `${settings.boo.Server}/helpers/m3u8?url=${encodeURIComponent(url)}`
	console.log(toReturn)
	return toReturn
}

export const getUpdates = async (): Promise<{ latest: Release, previous: Release[] }> => {
	const { boo } = await getSettings()
	const res = await fetch(`${boo.Server}/updates`)
	const data = await res.json() as { latest: Release, previous: Release[] }
	return data
}
