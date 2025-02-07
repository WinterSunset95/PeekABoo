import { Release } from "./types.ts";

export const data: { latest: Release, previous: Release[] } = {
	latest: {
		Version: "1.0.5",
		Apk: "/apk/peekaboo-1.0.5.apk",
		ChangeLogs: `
		- Changed the way socket connections are handled
		- Added a proper login page
		- Changed the user connection method
		- Fixed useState() bugs using useRef()
		`,
	},
	previous: [
		{
			Version: "1.0.1",
			Apk: "https://github.com/WinterSunset95/PeekABoo/releases/download/1.0.1/app-debug.apk",
			ChangeLogs: "Added support for sockets"
		},
		{
			Version: "1.0.0",
			Apk: "https://github.com/WinterSunset95/PeekABoo/releases/download/1.0.0/app-debug.apk",
			ChangeLogs: "Initial version of my app"
		}
	]
}
