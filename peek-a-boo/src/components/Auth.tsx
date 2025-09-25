import { useContext, useRef, useState } from "react"
import { UserContext } from "../App"
import { IonButton, IonInput, IonTab, IonTabBar, IonTabButton, IonTabs, useIonAlert, useIonRouter } from "@ionic/react"
import SettingsPage from "../pages/Settings"
import { socket } from "../lib/socket"
import { app, auth } from "../lib/firebase"

interface AuthProps {
    returnUrl?: string,
    modalRef?: React.RefObject<HTMLIonModalElement>
}

const AuthComponent: React.FC<AuthProps> = ({ returnUrl, modalRef }) => {
    const user = useContext(UserContext)
    if (!user) {
        return "There is a REALLYY horrible error under the hood if you can see this message!! Reload the app or contact the developer!!"
    }
    const [ showAlert ] = useIonAlert()
    const [disabled, setDisabled] = useState(false)
    const { name } = user
    const router = useIonRouter()

    const connectSocket = () => {
        if (name.current.length == 0) {
            showAlert("The username should not be empty")
            return
        }
		setDisabled(true)
		socket.connect()
		setTimeout(() => {
            setDisabled(false)
        }, 5000)
    }

    if (user.user) {
        if (returnUrl) {
            router.push(returnUrl, "forward", "replace")
        } else if (modalRef && modalRef.current != null) {
            modalRef.current.dismiss()
        }
    }

    return (
        <div className="main">
            <h1>
                The app does NOT save any data. Everything you do here WILL disappear the moment you close your session.
            </h1>
            <form className="form" onSubmit={(e) => {
                e.preventDefault()
                connectSocket()
            }}>
                <IonInput placeholder='Enter a username'
                label='Username'
                fill='outline'
                labelPlacement='floating'
                value={name.current}
                onIonInput={(e) => name.current = e.target.value as string}
                disabled={disabled}
                ></IonInput>
                <IonButton type='submit' expand='block' className='form-button' disabled={disabled}>Submit</IonButton>
            </form>
        </div>
    )
}

export default AuthComponent
