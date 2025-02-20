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
import { getMovieInfo, getTvInfo } from "../../lib/movies";

interface RoomModeProps extends RouteComponentProps<{
	type: string,
    id: string,
}> {}

const RoomMode: React.FC<RoomModeProps> = ({ match }) => {
    const [room, setRoom] = useState<OpenRoom>()
    const [info, setInfo] = useState<MediaInfo>()
    const router = useIonRouter()
	console.log(match.params.type, match.params.id)

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
		console.log(res.boo.CurrentMedia)
        const showId = res.boo.CurrentMedia.Id
		const type = res.boo.CurrentMedia.Type
		const choice = async () => {
			if (type == "anime") return getAnimeInfo(showId)
			else if (type == "tv") return getTvInfo(showId)
			else return getMovieInfo(showId)
		}
        const anInfo = await choice()
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
