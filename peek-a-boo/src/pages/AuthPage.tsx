import { IonPage, IonTab, IonTabBar, IonTabButton, IonTabs } from "@ionic/react"
import AuthComponent from "../components/Auth"
import SettingsPage from "./Settings"

const AuthPage: React.FC = () => {
    return (
        <IonPage>
            <IonTabs>
                <IonTab tab='form'>
                    <AuthComponent />
                </IonTab>
                <IonTab tab='settings'>
                    <SettingsPage />
                </IonTab>

                <IonTabBar>
                    <IonTabButton tab='form'>Form</IonTabButton>
                    <IonTabButton tab='settings'>Settings</IonTabButton>
                </IonTabBar>

            </IonTabs>
        </IonPage>
    )
}

export default AuthPage