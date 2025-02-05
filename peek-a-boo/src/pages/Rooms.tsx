import { IonAvatar, IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonList, IonPage, IonTitle, IonToolbar, useIonAlert, useIonRouter } from "@ionic/react"
import { socket } from "../lib/socket"
import { OpenRoom, PeekABoo, RoomCreate, RoomRequest, User } from "../lib/types"
import { useContext, useEffect, useState } from "react"

import './Rooms.css'
import { UserContext } from "../App"
import { getRoomsList } from "../lib/rooms"

const Rooms: React.FC = () => {
    const [rooms, setRooms] = useState<OpenRoom[]>()
    const [sockId, setSockId] = useState(socket.id)
    const [roomname, setRoomname] = useState("")
    const user = useContext(UserContext)
    const router = useIonRouter()
    const [ showAlert, nothing ] = useIonAlert()

    const createRoom = () => {
        if (!user || !sockId) {
            showAlert("Userdata does not exist for some reason, Please restart the app or contact the developer!")
            return
        }

        let roomId = roomname.replaceAll(/[^a-zA-Z]/g, "-")
        roomId = roomId.toLowerCase()
        const randomNum = Math.floor(100000 + Math.random() * 900000)
        roomId = roomId + "-" + randomNum.toString()

        const newRoom: OpenRoom = {
            ...user,
            RoomId: roomId,
            RoomName: roomname,
            Participants: [],
            Messages: []
        }
        console.log("Creating room")
        console.log(newRoom)
        socket.emit("addRoom", newRoom)
    }

    const joinRoom = (item?: OpenRoom) => {
        if (!sockId) return
        const request: RoomRequest = {
            RoomId: item ? item.RoomId : roomname,
            RequesterId: sockId
        }
        socket.timeout(10000).emit("roomRequest", request, (err: any, room: OpenRoom | undefined) => {
            if (err) {
                showAlert("Room owner did not respond!!")
                return
            }
            if (!room) {
                showAlert("Either the room does not exist, or the owner declined your entry")
                return
            }
            router.push(`${item ? item.CurrentMedia ? `/room/${item.RoomId}` : `/chat/${item.RoomId}` : `/room/${roomname}`}`, "forward", "push")
        })
    }
    
    socket.on("newRoomAdded", (data: PeekABoo<OpenRoom>) => {
        if (rooms) {
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
            showAlert(data)
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
                    value={roomname} onIonInput={(e) => setRoomname(e.target.value as string)}></IonInput>
                    <div className="room-form-buttons">
                        <IonButton onClick={() => joinRoom()}>Join Room</IonButton>
                        <IonButton onClick={createRoom}>Create Room</IonButton>
                    </div>
                </div>
                <IonList className="main-list" lines="none">
                    {rooms?.map((item, index) => {
                        return (
                            <IonItem
                                key={index}
                                onClick={() => joinRoom(item)}
                                button={true}
                            >
                                <div
                                    className="list-item"
                                >
                                    <div className="avatar-and-name">
                                        <IonAvatar slot="start">
                                            <img src={item.UserImage} alt="" />
                                        </IonAvatar>
                                        <span>{item.UserName}</span>
                                    </div>
                                    <div className="room-and-owner">
                                        <div>Room Name: {item.RoomName}</div>
                                        <div>RoomID: {item.RoomId}</div>
                                        <div>OwnerID: {item.UserId}</div>
                                        {item.CurrentMedia ?
                                        <div>
                                            Watching: {item.CurrentMedia.Title}
                                        </div>
                                        :
                                        <div>
                                            Chat-only Room
                                        </div>
                                        }
                                    </div>
                                </div>
                            </IonItem>
                        )
                    })}
                </IonList>
            </IonContent>
        </IonPage>
    )
} 

export default Rooms