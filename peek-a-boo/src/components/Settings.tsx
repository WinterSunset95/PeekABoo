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
} from "@ionic/react"

import "./Settings.css"
import { useContext, useEffect, useState } from "react"
import { AppSettings } from "../AppContext"
import { Settings, SettingsAnimeSources, SettingsAnimeTypes, SettingsMovieSources } from "../lib/types"

const SettingsPage: React.FC = () => {
	const globalSettingsString = localStorage.getItem("PeekABooSettings") as string
	const globalSettings = JSON.parse(globalSettingsString) as Settings
	const { settings, setSettings } = useContext(AppSettings)
	const [type, setType] = useState(globalSettings.AnimeType)
	const [aniSource, setAniSource] = useState(globalSettings.AnimeSource)
	const [movSource, setMovSource] = useState(globalSettings.MovieSource)

	const changeSettings = () => {
		const newSettings: Settings = {
			AnimeType: type,
			AnimeSource: aniSource,
			MovieSource: movSource
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
				<div className="setting">
					<span>
						Player Type: 
					</span>
					<select name="type" id="type" value={type}
						onChange={(e) => changeSettings()}
					>
					{SettingsAnimeTypes.map((item, index) => (
						<option value={item} key={index}
						onClick={() => setType(item)}>{item}</option>
					))}
					</select>
				</div>
				<div className="setting">
					<span>
						Anime Source:
					</span>
					<select name="anisource" id="anisource" value={aniSource}
						onChange={(e) => changeSettings()}
					>
					{SettingsAnimeSources.map((item, index) => (
						<option value={item} key={index}
						onClick={() => setAniSource(item)}>{item}</option>
					))}
					</select>
				</div>
				<div className="setting">
					<span>
						Movie Source:
					</span>
					<select name="movsource" id="movsource" value={movSource}
						onChange={(e) => changeSettings()}
					>
					{SettingsMovieSources.map((item, index) => (
						<option value={item} key={index}
						onClick={() => setMovSource(item)}>{item}</option>
					))}
					</select>
				</div>
				<IonButton onClick={() => changeSettings()}>Save</IonButton>
			</IonContent>
		</IonPage>
	)
}

export default SettingsPage
