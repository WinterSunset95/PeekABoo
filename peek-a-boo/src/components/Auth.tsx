import { useContext, useRef, useState } from "react"
import { UserContext } from "../App"
import { IonButton, IonInput, IonTab, IonTabBar, IonTabButton, IonTabs, useIonAlert, useIonRouter } from "@ionic/react"
import SettingsPage from "../pages/Settings"
import { socket } from "../lib/socket"
import { app, auth } from "../lib/firebase"
import { FirebaseAuthentication } from "@capacitor-firebase/authentication"
import { getAuth, GoogleAuthProvider, signInWithCredential } from "firebase/auth"

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

    const signInWithGoogle = async () => {
      try {
        setDisabled(true)
        const result = await FirebaseAuthentication.signInWithGoogle();
        const credential = GoogleAuthProvider.credential(result.credential?.idToken)
        const auth = getAuth(app)
        signInWithCredential(auth, credential)
      } catch (error) {
        console.error("Google Sign-In Error", error);
        showAlert("Failed to signin with Google.")
      } finally {
        setDisabled(false)
      }
    }

    //const connectSocket = () => {
    //    if (name.current.length == 0) {
    //        showAlert("The username should not be empty")
    //        return
    //    }
		//setDisabled(true)
		//socket.connect()
		//setTimeout(() => {
    //        setDisabled(false)
    //    }, 5000)
    //}

    //if (user.user) {
    //    if (returnUrl) {
    //        router.push(returnUrl, "forward", "replace")
    //    } else if (modalRef && modalRef.current != null) {
    //        modalRef.current.dismiss()
    //    }
    //}

    return (
        <div className="main">
            <form className="form" onSubmit={(e) => {
                e.preventDefault()
                //connectSocket()
            }}>
                <IonInput placeholder='Enter a username'
                  label='Email'
                  fill='outline'
                  labelPlacement='floating'
                  value={name.current}
                  onIonInput={(e) => name.current = e.target.value as string}
                  disabled={disabled}
                ></IonInput>
                <IonInput placeholder='Enter a username'
                  label='Password'
                  fill='outline'
                  labelPlacement='floating'
                  value={name.current}
                  onIonInput={(e) => name.current = e.target.value as string}
                  disabled={disabled}
                ></IonInput>
                <IonButton type='submit' expand='block' className='form-button' disabled={disabled}>Submit</IonButton>
            </form>
            <IonButton expand='block' className='form-button' disabled={disabled} onClick={signInWithGoogle}>
              Sign in with Google
            </IonButton>
        </div>
    )
}

export default AuthComponent
