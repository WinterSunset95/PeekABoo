import { RouteComponentProps } from "react-router";
import AnimeInfoPage from "./AnimeInfo";
import Room from "../../components/Room";
import { useContext, useEffect, useState } from "react";
import { OpenRoom } from "../../lib/types";
import { getRoom } from "../../lib/rooms";
import { socket } from "../../lib/socket";
import { IonAvatar, IonContent, IonHeader, IonLabel, IonPage, IonText, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";
import LoadingComponent from "../../components/Loading";
import { UserContext } from "../../App";
import "./ChatMode.css"

interface ChatProps extends RouteComponentProps<{
    id: string
}> {}

const ChatMode: React.FC<ChatProps> = ({ match }) => {
    const [openRoom, setOpenRoom] = useState<OpenRoom>()
    const router = useIonRouter()
    const userContext = useContext(UserContext)
    if (!userContext || !userContext.setUser || !userContext.user) {
        router.push("/login", "forward", "push")
        return
    }
    const { user, setUser } = userContext;

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
            <IonHeader>
                <IonToolbar>
                    <IonAvatar slot="start"
                        style={{
                            width: "2.5rem",
                            height: "2.5rem",
                            margin: "0.5rem"
                        }}
                    >
                        <img src={openRoom.UserImage} alt="" />
                    </IonAvatar>
                    <IonLabel>
                        {openRoom.RoomName} <br />
                        <span style={{
                            fontSize: "0.7rem"
                        }}>
                            ID: {user ? user.UserId : openRoom.RoomId}
                        </span>
                    </IonLabel>
                </IonToolbar>
            </IonHeader>
            <IonContent>
				<div className="room-container">
					<Room {...openRoom} />
				</div>
            </IonContent>
        </IonPage>
    )
}

export default ChatMode
