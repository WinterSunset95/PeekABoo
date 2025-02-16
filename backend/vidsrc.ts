//import puppeteer from "npm:puppeteer"
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts"
import * as cheerio from "npm:cheerio"

let BASEURL = "https://example.com";

interface Servers {
	name?: string,
	dataHash?: string 
}

interface ApiRes {
	name?: string,
	image?: string,
	mediaId?: string,
	stream?: string,
	referer: string
}

interface RcpRes {
	metadata: {
		image: string
	},
	data: string
}

const loadServers = (rawHtml: string): { servers: Servers[]; title: string } => {
	const $ = cheerio.load(rawHtml)
	const serversArr: Servers[] = [];
	const title = $("title").text() ?? "";
	const base = $("iframe").attr("src") ?? ""
	BASEURL = new URL(base.startsWith("//") ? `https:${base}` : base).origin ?? BASEURL;
	console.log(BASEURL)
	$(".serversList .server").each((index, element) => {
		const server = $(element)
		serversArr.push({
			name: server.text().trim(),
			dataHash: server.attr("data-hash")
		})
	})

	return {
		servers: serversArr,
		title: title
	}
}

const getProrcp = async (rcpUrl: string, browser: puppeteer.Browser): Promise<string | undefined> => {
	const page = await browser.newPage()
	await page.goto(rcpUrl)
	const html = await page.content()

	console.log(html)
	const regex = /src: '([^']*)'/
	const match = html.match(regex)
	console.log(match)

	browser.close()
	if (!match) return undefined
	return match[1]
}

const getM3u8FromProrcp = async (prorcp: string): Promise<string | undefined> => {
	const res = await fetch(`${BASEURL}/prorcp/${prorcp}`)
	const resText = await res.text();

	const script = resText.match(/<script\s+src="\/([^"]*\.js)\?\_=([^"]*)"><\/script>/gm);
	console.log(script)

	return ""
}

export const vidsrcScrape = async (tmdbId: string, type: "movie" | "tv", season?: number, episode?: number): Promise<ApiRes[]> => {

	const url = (type === "movie")
		? `https://vidsrc.net/embed/${type}?tmdb=${tmdbId}`
		: `https://vidsrc.to/embed/${type}?tmdb=${tmdbId}&season=${season}&episode=${episode}`
	// Get the raw html from the links above
	const embed = await fetch(url);
	const embedRes = await embed.text()

	const apiResponse: ApiRes[] = []
	// Load a list of servers and the title from the raw html
	const { servers, title } = loadServers(embedRes)
	console.log("Movie title: " + title)
	console.log(servers)

	// Vidsrc has an iframe which embeds from /rcp/<server hash>
	// Which in turn has another iframe which embeds from /prorcp/<some random hash>
	// To get that /prorcp/<hash>, we will use puppeteer to open up the link in
	// A headless browser, and grab the html
	const browser = await puppeteer.launch();
	const proRcpArr = await Promise.all(servers.map(server => {
		return getProrcp(`${BASEURL}/rcp/${server.dataHash}`, browser)
	}))

	//const rcpFetchPromises = servers.map(server => {
	//	return fetch(`${BASEURL}/rcp/${server.dataHash}`)
	//})

	//const rcpResponses = await Promise.all(rcpFetchPromises)
	//const proRcpArr = await Promise.all(rcpResponses.map(async (res) => {
	//	return getProrcp(await res.text(), browser)
	//}))

	for (const item of proRcpArr) {
		if (!item) continue;
		switch (item.substring(0,8)) {
			case "/prorcp/":
				apiResponse.push({
					name: title,
					image: "",
					mediaId: tmdbId,
					stream: await getM3u8FromProrcp(item.replace("/prorcp/", "")),
					referer: BASEURL
				})
		}
	}

	return apiResponse
}
