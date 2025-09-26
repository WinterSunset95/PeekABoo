import { IonPage, IonTab, IonTabBar, IonTabButton, IonTabs } from "@ionic/react"
import AuthComponent from "../components/Auth"
import SettingsPage from "./Settings"
import { RouteComponentProps, useParams } from "react-router"

interface AuthPageProps extends RouteComponentProps<{
	returnUrl?: string
}> {}

const AuthPage: React.FC = () => {
	const urlParams = new URLSearchParams(window.location.search)
	const returnUrl = urlParams.get("return") as string | undefined
    return (
        <IonPage>
            <IonTabs>
                <IonTab tab='form'>
                    <AuthComponent returnUrl={returnUrl} />
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
