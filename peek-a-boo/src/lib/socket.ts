import { io } from "socket.io-client";
import { getSettings } from "./storage";
import { PeekABoo, Settings } from "./types";

export const socket = io((await getSettings()).boo.Server, {
    autoConnect: false
})