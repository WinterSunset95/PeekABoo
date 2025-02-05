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
	useIonAlert,
} from "@ionic/react"

import React from "react"
import "./Settings.css"
import { useContext, useEffect, useState } from "react"
import { AnimeSourceOptions, AnimeTypeOptions, MovieSourceoptions, Settings, SettingsAnimeSources, SettingsAnimeTypes, SettingsMovieSources, SettingsServers, ServerOptions } from "../lib/types"
import { getSettings, setSettings } from "../lib/storage"

const SettingsPage: React.FC = () => {
	const [type, setType] = useState<AnimeTypeOptions>()
	const [aniSource, setAniSource] = useState<AnimeSourceOptions>()
	const [movSource, setMovSource] = useState<MovieSourceoptions>()
	const [server, setServer] = useState<ServerOptions>()
	const [ openAlert, other ] = useIonAlert()

	const changeSettings = async () => {
		if (!type || !aniSource || !movSource || !server) return;
		const newSettings: Settings = {
			AnimeType: type,
			AnimeSource: aniSource,
			MovieSource: movSource,
			Server: server
		}
		const res = await setSettings(newSettings)
		if (res.peek == false) {
			alert(res.boo)
			return
		} else {
			alert("New Settings: " + JSON.stringify(newSettings))
			window.location.reload()
		}
	}

	const loadSettings = async () => {
		const settings = await getSettings()
		if (settings.peek == false) {
			openAlert("Failed to load settings. This is not supposed to happen")
		}
		const appSettings = settings.boo as Settings
		setType(appSettings.AnimeType)
		setAniSource(appSettings.AnimeSource)
		setMovSource(appSettings.MovieSource)
		setServer(appSettings.Server)
		console.log(appSettings)
	}

	useEffect(() => {
		loadSettings()
	}, [])

	if (!type) {
		return (
			<IonPage>
				<IonContent>
					<h1>Loading . . </h1>
				</IonContent>
			</IonPage>
		)
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
							onIonChange={(e) => setType(e.target.value)}
						>
							{SettingsAnimeTypes.map((item, index) => (
								<IonSelectOption
									value={item}
									key={index}
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
							onIonChange={(e) => setAniSource(e.target.value)}
						>
							{SettingsAnimeSources.map((item, index) => (
								<IonSelectOption
									value={item}
									key={index}
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
							onIonChange={(e) => setMovSource(e.target.value)}
						>
							{SettingsMovieSources.map((item, index) => (
								<IonSelectOption
									value={item}
									key={index}
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
							onIonChange={(e) => setServer(e.target.value)}
						>
							{SettingsServers.map((item, index) => (
								<IonSelectOption
									value={item}
									key={index}
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
