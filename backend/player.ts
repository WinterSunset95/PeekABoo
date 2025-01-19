import { RouterContext } from "@oak/oak";

export const sanitizeIframe = async (url: string) => {
	try {
		const res = await fetch(url)
		console.log(res)
	} catch (e) {
		console.log(e)
	}
}

export const streamM3u8 = async (url: string) => {
	console.log(url)
}
