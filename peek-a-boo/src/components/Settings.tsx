import {
	IonNavLink,
	IonCard,
	IonCardTitle,
	IonImg,
	IonHeader,
	IonContent,
	IonToolbar,
	IonButtons,
	IonBackButton,
	IonTitle,
    IonButton,
	IonPage,
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption,
} from "@ionic/react"

import "./Settings.css"
import { useContext, useEffect, useState } from "react"
import { AppSettings } from "../AppContext"
import { Settings, SettingsAnimeSources, SettingsAnimeTypes, SettingsMovieSources, SettingsServers } from "../lib/types"

const SettingsPage: React.FC = () => {
	const globalSettingsString = localStorage.getItem("PeekABooSettings") as string
	const globalSettings = JSON.parse(globalSettingsString) as Settings
	const { settings, setSettings } = useContext(AppSettings)
	const [type, setType] = useState(globalSettings.AnimeType)
	const [aniSource, setAniSource] = useState(globalSettings.AnimeSource)
	const [movSource, setMovSource] = useState(globalSettings.MovieSource)
	const [server, setServer] = useState(globalSettings.Server)

	const changeSettings = () => {
		const newSettings: Settings = {
			AnimeType: type,
			AnimeSource: aniSource,
			MovieSource: movSource,
			Server: server
		}
		localStorage.setItem("PeekABooSettings", JSON.stringify(newSettings))
	}

	return (
		<IonPage>
			<IonHeader
				translucent={true}
				className='ion-padding'
			>
				<IonTitle>Settings</IonTitle>
			</IonHeader>
			<IonContent className="ion-padding">
				<IonList>
					<IonItem>
						<IonSelect
							label="Advertisements"
							value={type}
							onChange={(e) => changeSettings()}
						>
							{SettingsAnimeTypes.map((item, index) => (
								<IonSelectOption
									value={item}
									key={index}
									onClick={() => setType(item)}
								>
									{item}
								</IonSelectOption>
							))}
						</IonSelect>
					</IonItem>
					<IonItem>
						<IonSelect
							label="Anime Source"
							value={aniSource}
							onChange={(e) => changeSettings()}
						>
							{SettingsAnimeSources.map((item, index) => (
								<IonSelectOption
									value={item}
									key={index}
									onClick={() => setAniSource(item)}
								>
									{item}
								</IonSelectOption>
							))}
						</IonSelect>
					</IonItem>
					<IonItem>
						<IonSelect
							label="Movie Source"
							value={movSource}
							onChange={(e) => changeSettings()}
						>
							{SettingsMovieSources.map((item, index) => (
								<IonSelectOption
									value={item}
									key={index}
									onClick={() => setMovSource(item)}
								>
									{item}
								</IonSelectOption>
							))}
						</IonSelect>
					</IonItem>
					<IonItem>
						<IonSelect
							label="Backend Server"
							value={server}
							onChange={(e) => changeSettings()}
						>
							{SettingsServers.map((item, index) => (
								<IonSelectOption
									value={item}
									key={index}
									onClick={() => setServer(item)}
								>
									{item}
								</IonSelectOption>
							))}
						</IonSelect>
					</IonItem>
				</IonList>
				<IonButton onClick={() => changeSettings()}>Save</IonButton>
			</IonContent>
		</IonPage>
	)
}

export default SettingsPage
