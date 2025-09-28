import { useContext, useEffect, useRef, useState } from "react"
import { UserContext } from "../App"
import { IonPage, IonContent, IonButton, IonInput, IonTab, IonTabBar, IonTabButton, IonTabs, useIonAlert } from "@ionic/react"
import SettingsPage from "../pages/Settings"
import { socket } from "../lib/socket"
import { app, auth } from "../lib/firebase"
import { FirebaseAuthentication } from "@capacitor-firebase/authentication"
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithCredential } from "firebase/auth"

interface AuthProps {
    returnUrl?: string,
    modalRef?: React.RefObject<HTMLIonModalElement>
}

const AuthComponent: React.FC<AuthProps> = ({ returnUrl, modalRef }) => {
    const { user, setUser, name} = useContext(UserContext)
    const [ showAlert ] = useIonAlert()
    const [disabled, setDisabled] = useState(false)
    //const router = useIonRouter()

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

    useEffect(() => {
      document.title = "PeekABoo"
      onAuthStateChanged(auth, (newLoginUser) => {
        if (newLoginUser != null) {
          setUser(newLoginUser)
        } else {
          setUser(null)
        }
      })
    }, [])

    return (
      <IonPage>
        <IonContent fullscreen>
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
        </IonContent>
      </IonPage>
    )
}

export default AuthComponent
