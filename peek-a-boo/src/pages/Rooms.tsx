import { IonAvatar, IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonList, IonPage, IonTitle, IonToolbar, useIonAlert, useIonRouter } from "@ionic/react"
import { socket } from "../lib/socket"
import { OpenRoom, PeekABoo, RoomCreate, RoomRequest, User } from "../lib/types"
import { useContext, useEffect, useState } from "react"

import './Rooms.css'
import { UserContext } from "../App"
import { getRoomsList } from "../lib/rooms"
import AuthComponent from "../components/Auth"

const Rooms: React.FC = () => {
    const [rooms, setRooms] = useState<OpenRoom[]>([])
    const [sockId, setSockId] = useState(socket.id)
    const [roomname, setRoomname] = useState("")
    const [disabled, setDisabled] = useState(false)
    const router = useIonRouter()
    const userContext = useContext(UserContext)
    const [ showAlert, nothing ] = useIonAlert()

    const initialLoad = async () => {
        const res = await getRoomsList()
        setRooms(res.boo)
    }

    const user = userContext?.user
    const setUser = userContext?.setUser
    const name = userContext?.name

    const createRoom = () => {
        if (!user || !sockId) {
            showAlert("Userdata does not exist for some reason, Please restart the app or contact the developer!")
            return
        }

        setDisabled(true)
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
        socket.timeout(5000).emit("addRoom", newRoom, (err: any, result: string) => {
            if (err) {
                showAlert("Failed to create room")
                setDisabled(false)
                return
            }
            if (result == "ok") {
                setDisabled(false)
                return
            } else {
                showAlert(result)
                setDisabled(false)
            }
        })
    }

    const joinRoom = (item?: OpenRoom) => {
        if (!sockId) return
        setDisabled(true)
        const request: RoomRequest = {
            RoomId: item ? item.RoomId : roomname,
            RequesterId: sockId
        }
        socket.timeout(10000).emit("roomRequest", request, (err: any, room: OpenRoom | undefined) => {
            if (err) {
                showAlert("Room owner did not respond!!")
                setDisabled(false)
                return
            }
            if (!room) {
                showAlert("Either the room does not exist, or the owner declined your entry")
                setDisabled(false)
                return
            }
            setDisabled(false)
            router.push(`${item ? item.CurrentMedia ? `/room/${item.RoomId}` : `/chat/${item.RoomId}` : `/room/${roomname}`}`, "forward", "push")
        })
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
			if (!socket.id || !name || !setUser) return
			console.log(`Connected as: ${socket.id}`)
			socket.emit("addUser", {
				UserId: socket.id,
				UserName: name.current,
				UserImage: "https://avatar.iran.liara.run/username?username=" + name.current
			}, (returnedUser: User) => {
				setUser(returnedUser)
			})
        })

        socket.on("newRoomAdded", (data: PeekABoo<OpenRoom>) => {
            setRooms((prev) => [...prev, data.boo])
        })

        socket.on("roomRemoved", (data: PeekABoo<OpenRoom>) => {
            setRooms((prev) => {
                const roomsCopy = prev
                for (let i=roomsCopy.length-1; i>=0; --i) {
                    if (roomsCopy[i].UserId == data.boo.UserId) {
                        roomsCopy.splice(i,1)
                    }
                }
                return roomsCopy
            })
        })


        return () => {
            socket.off("socketError")
            socket.off("getRooms")
            socket.off("connect")
            socket.off("newRoomAdded")
            socket.off("roomRemoved")
        }

    }, [])

    if (!userContext || !userContext.user || !userContext.setUser) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Login</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <AuthComponent />
                </IonContent>
            </IonPage>
        )
    }
    
    return (
        <IonPage>
            <IonToolbar>
                <IonTitle slot="start">Room</IonTitle>
                <IonTitle slot="end" className="socket-id">ID: {sockId}</IonTitle>
            </IonToolbar>
            <IonContent className="ion-padding">
                <section className="room-main">

                <IonInput placeholder="Enter room id" labelPlacement="floating" label="Room ID" fill="outline" name="roomid" 
                value={roomname} onIonInput={(e) => setRoomname(e.target.value as string)}></IonInput>
                <div className="room-form-buttons">
                    <IonButton onClick={() => joinRoom()} disabled={disabled}>Join Room</IonButton>
                    <IonButton onClick={createRoom} disabled={disabled}>Create Room</IonButton>
                </div>
                <ul className="main-list">
                    {rooms?.map((item, index) => {
                        return (
                            <IonItem
                                key={index}
                                onClick={() => joinRoom(item)}
                                button={true}
                                disabled={disabled}
                            >
                                <div
                                    className="list-item"
                                >
                                    <IonAvatar slot="start" className="user-avatar">
                                        <img src={item.UserImage} alt=""/>
                                    </IonAvatar>
                                    <div className="room-and-owner">
                                        <h1>
                                        {item.RoomName}
                                        </h1>
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
                </ul>

                </section>
            </IonContent>
        </IonPage>
    )
} 

export default Rooms