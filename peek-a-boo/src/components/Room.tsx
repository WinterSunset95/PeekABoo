import { RouteComponentProps } from "react-router"
import { ActiveAnimeRoom, ChatMessage, OpenRoom, RoomMessage, RoomRequest } from "../lib/types"
import { socket } from "../lib/socket"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../App"
import { IonAvatar, IonButton, IonInput, IonItem, IonText, IonToast, useIonToast } from "@ionic/react"

import './Room.css'

const Room: React.FC<OpenRoom> = (room) => {
    const [messages, setMessages] = useState<ChatMessage[]>(room.Messages)
    const [text, setText] = useState("")
    const user = useContext(UserContext)
    const [ showToast, hideToast ] = useIonToast()

    const sendMessage = () => {
        if (!user) return
        const message: RoomMessage<ChatMessage> = {
            RoomId: room.RoomId,
            SenderId: user.UserId,
            Payload: {
                ...user,
                MessageType: "text",
                Message: text
            }
        }
        console.log("Sending: ")
        console.log(message)
        socket.emit("chatMessage", message)
        setText("")
    }

    useEffect(() => {
        socket.emit("joinRoom", room.RoomId)

        socket.on("roomRequest", (requester: RoomRequest, callback: (response: string) => void) => {
            showToast({
                message: `${requester.RequesterId} requested to join the room`,
                duration: 9000,
                buttons: [
                    {
                        text: "Accept",
                        role: "accept",
                        handler: () => {
                            console.log("Accepting")
                            callback("accepted")
                        }
                    },
                    {
                        text: "Reject",
                        role: "reject",
                        handler: () => {
                            callback("rejected")
                        }
                    }
                ],
                onDidDismiss: () => callback("rejected")
            })
        })

        socket.on("chatMessage", (data: RoomMessage<ChatMessage>) => {
            console.log("New message: " + data.Payload.Message)
            setMessages((prev) => [data.Payload, ...prev])
        })



        return () => {
            socket.emit("leaveRoom", room.RoomId)
            socket.off("roomRequest")
            socket.off("chatMessage")
        }
    }, [])

    return (
        <div className="room-chat">
            <ul className="room-chat-list">
                {messages.map((message, index) => {
                    return (
                        <li key={index}>

                        <IonItem className="chat-list-item">
                            <IonAvatar slot="start">
                                <img src={message.UserImage} />
                            </IonAvatar>
                            <div className="chat-message">
                                <IonText class="chat-message-name">{message.UserName}: {message.UserId}</IonText>
                                <IonText className="chat-message-text">{message.Message}</IonText>
                            </div>
                        </IonItem>
                        </li>
                    )
                })}
            </ul>
            <form className="input-area" onSubmit={(e) => {
                e.preventDefault()
                sendMessage()
            }}>
                <IonInput
                    placeholder="Chat"
                    label="Chat"
                    labelPlacement="floating"
                    fill="outline"
                    value={text}
                    onIonInput={(e) => setText(e.target.value as string)}
                    autoFocus={true}
                ></IonInput>
                <IonButton type="submit">Send</IonButton>
            </form>
        </div>
    )

}

export default Room