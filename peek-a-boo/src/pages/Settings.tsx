import { IonPage, IonContent } from "@ionic/react"
import React, { useContext, useEffect, useState } from "react"
import { UserContext } from "../App"
import { auth } from "../lib/firebase"
import { AnimeSourceOptions, AnimeTypeOptions, MovieSourceoptions, ServerOptions, Settings, SettingsAnimeSources, SettingsAnimeTypes, SettingsMovieSources, SettingsServers } from "../lib/types"
import { getSettings, setSettings } from "../lib/storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { LogOut, UserCircle2, Trash2 } from "lucide-react"

const SettingsPage: React.FC = () => {
	const { user, setUser } = useContext(UserContext)
	const [showRestartDialog, setShowRestartDialog] = useState(false)

	const [type, setType] = useState<AnimeTypeOptions>("ad")
	const [aniSource, setAniSource] = useState<AnimeSourceOptions>()
	const [movSource, setMovSource] = useState<MovieSourceoptions>()
	const [server, setServer] = useState<ServerOptions>()

	const loadSettings = async () => {
		const settings = await getSettings()
		if (settings.peek == false) {
			toast.error("Failed to load settings. This is not supposed to happen")
			return
		}
		const appSettings = settings.boo as Settings
		setType(appSettings.AnimeType)
		setAniSource(appSettings.AnimeSource)
		setMovSource(appSettings.MovieSource)
		setServer(appSettings.Server)
	}

	useEffect(() => {
		loadSettings()
	}, [])

	const changeSettings = async () => {
		if (!type || !aniSource || !movSource || !server) return;
		const newSettings: Settings = {
			AnimeType: type,
			AnimeSource: aniSource,
			MovieSource: movSource,
			Server: server
		}
		const res = await setSettings(newSettings)
		if (res.peek == false || typeof res.boo == "string") {
			toast.error(res.boo as string)
			return
		} else {
			setShowRestartDialog(true)
		}
	}

	const handleLogout = async () => {
		await auth.signOut()
		setUser(null)
	}

	if (!user) {
		return (
			<IonPage>
				<header className="p-4 border-b">
					<h1 className="text-xl font-bold">Settings</h1>
				</header>
				<main className="flex-grow p-4">
					<div className="flex flex-col items-center justify-center h-full text-center">
						<h2 className="text-2xl font-semibold">Please Log In</h2>
						<p className="text-muted-foreground mt-2">Log in to manage your account settings.</p>
						<Button onClick={() => console.log("Hello")} className="mt-4">Login</Button>
					</div>
				</main>
			</IonPage>
		)
	}

	return (
		<IonPage>
      <IonContent>
			<header className="p-4 border-b sticky top-0 bg-background z-10">
				<h1 className="text-xl font-bold">Settings</h1>
			</header>
			<main className="p-4 space-y-8">
				<div className="flex items-center gap-4">
					<Avatar className="h-16 w-16">
						<AvatarImage src={user.photoURL ?? ""} alt={user.displayName ?? ""} />
						<AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
					</Avatar>
					<div>
						<h2 className="text-xl font-semibold">{user.displayName}</h2>
						<p className="text-sm text-muted-foreground">{user.email}</p>
					</div>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Account</CardTitle>
						<CardDescription>Manage your account details.</CardDescription>
					</CardHeader>
					<CardContent>
						<Button variant="outline" className="w-full justify-start gap-2" disabled>
							<UserCircle2 className="h-5 w-5" />
							Edit Profile
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Application Settings</CardTitle>
						<CardDescription>Configure application behavior.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="ads-select">Advertisements</Label>
							<Select value={type} onValueChange={(value: AnimeTypeOptions) => setType(value)}>
								<SelectTrigger id="ads-select">
									<SelectValue placeholder="Select advertisement preference" />
								</SelectTrigger>
								<SelectContent>
									{SettingsAnimeTypes.map((item) => (
										<SelectItem key={item} value={item}>{item}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="anime-source-select">Anime Source</Label>
							<Select value={aniSource} onValueChange={(value: AnimeSourceOptions) => setAniSource(value)}>
								<SelectTrigger id="anime-source-select">
									<SelectValue placeholder="Select anime source" />
								</SelectTrigger>
								<SelectContent>
									{SettingsAnimeSources.map((item) => (
										<SelectItem key={item} value={item}>{item}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="movie-source-select">Movie Source</Label>
							<Select value={movSource} onValueChange={(value: MovieSourceoptions) => setMovSource(value)}>
								<SelectTrigger id="movie-source-select">
									<SelectValue placeholder="Select movie source" />
								</SelectTrigger>
								<SelectContent>
									{SettingsMovieSources.map((item) => (
										<SelectItem key={item} value={item}>{item}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="server-select">Backend Server</Label>
							<Select value={server} onValueChange={(value: ServerOptions) => setServer(value)}>
								<SelectTrigger id="server-select">
									<SelectValue placeholder="Select backend server" />
								</SelectTrigger>
								<SelectContent>
									{SettingsServers.map((item) => (
										<SelectItem key={item} value="test">{item}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>
				<Button onClick={changeSettings} disabled={!type || !aniSource || !movSource || !server} className="w-full">Save Settings</Button>

				<Card>
					<CardHeader>
						<CardTitle>Danger Zone</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<Button variant="outline" className="w-full justify-start gap-2 text-destructive" onClick={handleLogout}>
							<LogOut className="h-5 w-5" />
							Logout
						</Button>
						<Button variant="destructive" className="w-full justify-start gap-2" disabled>
							<Trash2 className="h-5 w-5" />
							Delete Account
						</Button>
					</CardContent>
				</Card>

				<AlertDialog open={showRestartDialog} onOpenChange={setShowRestartDialog}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Settings Saved</AlertDialogTitle>
						</AlertDialogHeader>
						<div>Your new settings have been saved. The app will now reload to apply them.</div>
						<AlertDialogFooter>
							<AlertDialogAction onClick={() => window.location.reload()}>OK</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>

			</main>
      </IonContent>
		</IonPage>
	)
}

export default SettingsPage
