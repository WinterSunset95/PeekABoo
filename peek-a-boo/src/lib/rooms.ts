import { getSettings } from "./storage";
import { OpenRoom, PeekABoo, RoomRequest } from "./types";

export const createRoom = async (room: OpenRoom): Promise<PeekABoo<OpenRoom>> => {
    const { boo } = await getSettings()
    const response = await fetch(`${boo.Server}/rooms/create`, {
        method: "POST",
        body: JSON.stringify(room)
    })
    let data = await response.json() as PeekABoo<OpenRoom>
    return data
}

export const getRoom = async (request: RoomRequest): Promise<PeekABoo<OpenRoom | undefined>> => {
    const { boo } = await getSettings()
    const response = await fetch(`${boo.Server}/rooms/get/${request.RoomId}?requester=${request.RequesterId}`)
    const data = await response.json() as PeekABoo<OpenRoom | undefined>
    return data
}

export const getRoomsList = async (): Promise<PeekABoo<OpenRoom[]>> => {
    const { boo } = await getSettings()
    const response = await fetch(`${boo.Server}/rooms/list`)
    const data = await response.json() as PeekABoo<OpenRoom[]>
    return data
}