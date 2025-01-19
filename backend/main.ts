// @deno-types="@oak/oak"
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { Application, Router } from "@oak/oak"
import type { RouterContext } from "@oak/oak/router";
import { getEpisodeInfo, getTrendingAnime } from "./anime.ts";
import { streamM3u8 } from "./player.ts";
import { PeekABoo } from "./types.ts";
import "jsr:@std/dotenv/load";

const router = new Router()

//const SERVER = "http://localhost:3000"
//const SERVER = "http://65.1.92.65"
const SERVER = Deno.env.get("SERVER")
console.log(SERVER)

router.get("/", (ctx) => {
	ctx.response.body = "Hello World!"
})

router.get("/anime/trending", async (ctx) => {
	const result = await getTrendingAnime()
	ctx.response.body = result
})

router.get("/helpers/sanitize-iframe", (ctx) => {
	const params = ctx.request.url.searchParams
	const videoUrl = params.get("url")
	ctx.response.body = videoUrl
})

router.get("/proxy", async (ctx) => {
	const url = ctx.request.url.searchParams.get("url") as string
	if (!url) {
		const errorRes: PeekABoo<string> = {
			peek: false,
			boo: "no url detected"
		}
		ctx.response.body = errorRes
	}

	try {
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error("failed to fetch " + response.statusText)
		}
		ctx.response.headers = response.headers
		ctx.response.type = response.type
		ctx.response.body = response.body
	} catch (e: unknown) {
		ctx.response.body = e as string
	}
})

router.get("/helpers/m3u8", async (ctx) => {
	const url = ctx.request.url.searchParams.get("url") as string
	if (!url) {
		const errorRes: PeekABoo<string> = {
			peek: false,
			boo: "no url detected"
		}
		ctx.response.body = errorRes
	}

	let urlArray = url.split("/")
	urlArray.pop()
	let newUrl = ""
	for (let i=0; i<urlArray.length; i++) {
		newUrl = newUrl + urlArray[i] + "/"
	}
	console.log(newUrl)

	try {
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error('Failed to fetch ' + response.statusText)
		}
		const m3u8Content = await response.text();
		let modifiedm3u8: string;
		if (m3u8Content.includes('.ts')) {
			modifiedm3u8 = m3u8Content.replace(
				/(.*\.ts)/g,
				(segment) => `${SERVER}/helpers/segment?url=${encodeURIComponent(newUrl + segment)}`
			)
		} else {
			modifiedm3u8 = m3u8Content.replace(
				/(.*\.m3u8)/g,
				(segment) => `${SERVER}/helpers/m3u8?url=${encodeURIComponent(newUrl + segment)}`
			)
		}

		ctx.response.headers.set("Content-Type", response.headers.get("content-type") || "application/vnd.apple.mpegurl");
		ctx.response.headers.set("Access-Control-Allow-Origin", "*");
		ctx.response.body = modifiedm3u8
	} catch (e) {
		const errorRes: PeekABoo<string> = {
			peek: false,
			boo: e as string
		}
		ctx.response.body = errorRes
	}
})

router.get("/helpers/segment", async (ctx) => {
	const url = ctx.request.url.searchParams.get("url") as string
	if (!url) {
		const errorRes: PeekABoo<string> = {
			peek: false,
			boo: "No url detected"
		}
		ctx.response.body = errorRes
	}

	try {
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error("failed to fetch " + response.statusText)
		}
		ctx.response.headers.set("Content-Type", response.headers.get("content-type") || "video/mp2t");
		ctx.response.headers.set("Access-Control-Allow-Origin", "*")
		ctx.response.body = response.body
	} catch (e: unknown) {
		ctx.response.body = e as string
	}
})

router.get("/anime/episode/:id", async (ctx: RouterContext<"/anime/episode/:id">) => {
	const id = ctx.params.id
	const result = await getEpisodeInfo(id)
	ctx.response.body = result
})

const app = new Application()
app.use(oakCors({
	origin: "*"
}))
app.use(router.routes())
app.use(router.allowedMethods())
app.listen({ port: 3000, })
