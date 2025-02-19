import { RouteComponentProps } from "react-router";
import AnimeInfoPage from "./AnimeInfo";
import { useEffect, useState } from "react";
import { AnimeInfo, MediaInfo, OpenRoom } from "../../lib/types";
import { getRoom } from "../../lib/rooms";
import { socket } from "../../lib/socket";
import { getAnimeInfo } from "../../lib/anime";
import { useIonRouter } from "@ionic/react";
import LoadingComponent from "../../components/Loading";
import InfoPage from "./InfoPage";

interface RoomModeProps extends RouteComponentProps<{
	type: string,
    id: string,
}> {}

const RoomMode: React.FC<RoomModeProps> = ({ match }) => {
    const [room, setRoom] = useState<OpenRoom>()
    const [info, setInfo] = useState<MediaInfo>()
    const router = useIonRouter()

    const initialLoad = async () => {
        const res = await getRoom({ RoomId: match.params.id, RequesterId: socket.id as string })
        if (!res.boo) {
            alert("This room does not exist")
            // Should route back to /home
            router.push("/home", "root", "replace")
            return
        }
        setRoom(res.boo)
        if (!res.boo.CurrentMedia) {
            alert("Room exists but it is a chat-only room")
            // Should route to /chat/:roomid
            router.push(`/chat/${match.params.id}`)
            return
        }
        const showId = res.boo.CurrentMedia.Id
        const anInfo = await getAnimeInfo(showId)
		if (anInfo.peek == false || typeof anInfo.boo == "string") {
			alert("Failed to get show information")
			return
		}
        setInfo(anInfo.boo)
    }

    useEffect(() => {
        initialLoad()
    }, [])

    if (!room || !info) return <LoadingComponent choice="full_page" />

    return <InfoPage openRoom={room} info={info} />
}

export default RoomMode
