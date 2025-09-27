import { RouteComponentProps } from "react-router";
import {
	IonPage,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
	IonIcon,
	IonButton,
	IonChip,
	IonAvatar,
	IonLabel,
	useIonToast,
	IonModal,
    useIonRouter
} from '@ionic/react';
import { useContext, useEffect, useRef, useState } from 'react';
import './UserPage.css'

interface UserPageProps extends RouteComponentProps<{
  id: string
}> {}

const UserPage: React.FC<UserPageProps> = ({ match }) => {
  return (
    <div></div>
  )
}

export default UserPage
