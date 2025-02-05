import { RouteComponentProps } from "react-router";
import AnimeInfoPage from "./AnimeInfo";
import Room from "../../components/Room";
import { useEffect, useState } from "react";
import { OpenRoom } from "../../lib/types";
import { getRoom } from "../../lib/rooms";
import { socket } from "../../lib/socket";
import { IonContent, IonPage, IonText, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";
import LoadingComponent from "../../components/Loading";

interface ChatProps extends RouteComponentProps<{
    id: string
}> {}

const ChatMode: React.FC<ChatProps> = ({ match }) => {
    const [openRoom, setOpenRoom] = useState<OpenRoom>()
    const router = useIonRouter()

    const initialLoad = async () => {
        const res = await getRoom({ RoomId: match.params.id, RequesterId: socket.id as string })
        if (!res.boo) {
            alert("This room does not exist")
            // Should route back to /home
            router.push("/home", "root", "replace")
            return
        }
        setOpenRoom(res.boo)
        
    }

    useEffect(() => {
        initialLoad()
    }, [])

    if (!openRoom) return <LoadingComponent choice="full_page" />

    return (
        <IonPage>
            <IonToolbar>
                <IonTitle slot="start">{openRoom.RoomName}</IonTitle>
                <IonText slot="end"
                    style={{
                        paddingRight: "1rem"
                    }}
                >ID: {openRoom.RoomId}</IonText>
            </IonToolbar>
            <IonContent>
                <Room {...openRoom} />
            </IonContent>
        </IonPage>
    )
}

export default ChatMode