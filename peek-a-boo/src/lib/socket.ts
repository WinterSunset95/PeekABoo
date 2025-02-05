import { io } from "socket.io-client";
import { getSettings } from "./storage";
import { PeekABoo, Settings } from "./types";

let settings: PeekABoo<Settings> = {
    peek: true,
    boo: {
        AnimeType: "adfree",
        AnimeSource: "gogo",
        MovieSource: "tmdb",
        Server: "http://65.1.92.65"
    }
}

async () => {
    settings = await getSettings()
}

export const socket = io(settings.boo.Server, {
    autoConnect: false
})