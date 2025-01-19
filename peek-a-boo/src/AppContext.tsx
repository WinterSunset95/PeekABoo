import { createContext, useState } from "react"
import { Settings } from "./lib/types"


const AppSettings = createContext<{
	settings: Settings,
	setSettings: React.Dispatch<React.SetStateAction<Settings>>
}>()

export {
	AppSettings
}
