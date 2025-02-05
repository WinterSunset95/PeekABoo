import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonList, IonPage, IonTitle, IonToolbar, useIonRouter } from "@ionic/react"
import { socket } from "../lib/socket"
import { OpenRoom, PeekABoo, RoomCreate, RoomRequest, User } from "../lib/types"
import { useContext, useEffect, useState } from "react"

import './Rooms.css'
import { UserContext } from "../App"
import { getRoomsList } from "../lib/rooms"

const Rooms: React.FC = () => {
    const [rooms, setRooms] = useState<OpenRoom[]>()
    const [sockId, setSockId] = useState(socket.id)
    const [roomid, setRoomid] = useState("")
    const user = useContext(UserContext)
    const router = useIonRouter()

    const createRoom = () => {
        if (!user || !sockId) {
            alert("Userdata does not exist for some reason, Please restart the app or contact the developer!")
            return
        }
        const newRoom: OpenRoom = {
            RoomId: roomid,
            OwnerId: sockId,
            ...user,
            Participants: [],
            Messages: []
        }
        socket.emit("addRoom", newRoom)
    }

    const joinRoom = (item?: OpenRoom) => {
        if (!sockId) return
        const request: RoomRequest = {
            RoomId: item ? item.RoomId : roomid,
            RequesterId: sockId
        }
        socket.timeout(10000).emit("roomRequest", request, (err: any, room: OpenRoom | undefined) => {
            if (err) {
                alert("Room owner did not respond!!")
                return
            }
            if (!room) {
                alert("Either the room does not exist, or the owner declined your entry")
                return
            }
            router.push(`${item ? item.CurrentMedia ? `/room/${item.RoomId}` : `/chat/${item.RoomId}` : `/room/${roomid}`}`, "forward", "push")
        })
    }

    
    socket.on("newRoomAdded", (data: PeekABoo<OpenRoom>) => {
        if (rooms) {
            console.log(rooms)
            setRooms([...rooms, data.boo])
            console.log([...rooms, data.boo])
        } else {
            setRooms([data.boo])
        }
    })
    socket.on("roomRemoved", (data: PeekABoo<OpenRoom>) => {
        if (!rooms) return
        const roomsCopy = rooms
        for (let i=roomsCopy.length-1; i>=0; --i) {
            if (roomsCopy[i].UserId == data.boo.UserId) {
                roomsCopy.splice(i,1)
            }
        }
        setRooms(roomsCopy)
    })

    const initialLoad = async () => {
        const res = await getRoomsList()
        setRooms(res.boo)
    }
    

    useEffect(() => {

        initialLoad()
        socket.on("socketError", (data: string) => {
            alert(data)
        })
        socket.on("getRooms", (rooms: OpenRoom[]) => {
            setRooms(rooms)
        })
        socket.on("connect", () => {
            setSockId(socket.id)
            console.log(`Connected: ${socket.id}`)
        })

        return () => {
            socket.off("socketError")
            socket.off("getRooms")
            socket.off("connect")
            socket.off("newRoomAdded")
            socket.off("roomRemoved")
        }

    }, [])

    return (
        <IonPage>
            <IonToolbar>
                <IonTitle slot="start">Room</IonTitle>
                <IonTitle slot="end" className="socket-id">ID: {sockId}</IonTitle>
            </IonToolbar>
            <IonContent className="room-main ion-padding">
                <div className="room-form">
                    <IonInput placeholder="Enter room id" labelPlacement="floating" label="Room ID" fill="outline" name="roomid" 
                    value={roomid} onIonInput={(e) => setRoomid(e.target.value as string)}></IonInput>
                    <div className="room-form-buttons">
                        <IonButton onClick={() => joinRoom()}>Join Room</IonButton>
                        <IonButton onClick={createRoom}>Create Room</IonButton>
                    </div>
                </div>
                <IonList>
                    {rooms?.map((item, index) => {
                        return (
                            <IonItem
                                // routerLink={
                                //     item.CurrentMedia ?
                                //     `/room/${item.RoomId}`
                                //     : `/chat/${item.RoomId}`
                                // }
                                key={index}
                                onClick={() => joinRoom(item)}
                            >
                                    {item.UserName}: {item.UserId} <br />
                                    {item.CurrentMedia ? "Active" : "Null"}
                            </IonItem>
                        )
                    })}
                </IonList>
            </IonContent>
        </IonPage>
    )
} 

export default Rooms