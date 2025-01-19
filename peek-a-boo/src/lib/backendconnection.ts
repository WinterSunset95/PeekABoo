const backendUrls = ["http://localhost:3000"]

export const proxyThisLink = (url: string): string => {
	const toReturn = `${backendUrls[0]}/helpers/m3u8?url=${encodeURIComponent(url)}`
	console.log(toReturn)
	return toReturn
}
