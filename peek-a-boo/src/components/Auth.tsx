import { useContext, useEffect, useState } from "react"
import { UserContext } from "../App"
import { app, auth } from "../lib/firebase"
import { 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Loader2 } from "lucide-react"

interface AuthProps {
    returnUrl?: string,
    modalRef?: React.RefObject<HTMLIonModalElement>
}

function AuthComponent({ returnUrl, modalRef }: AuthProps) {
    const { setUser } = useContext(UserContext)
    const [disabled, setDisabled] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const signInWithGoogle = async () => {
      try {
        setDisabled(true)
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        // The onAuthStateChanged listener in App.tsx will handle the user state change
      } catch (error) {
        console.error("Google Sign-In Error", error);
        toast.error("Failed to sign in with Google.")
      } finally {
        setDisabled(false)
      }
    }

    const handleEmailAuth = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || !password) {
        toast.error("Please enter email and password.");
        return;
      }
      setDisabled(true);
      try {
        if (isSignUp) {
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          await signInWithEmailAndPassword(auth, email, password);
        }
        // The onAuthStateChanged listener in App.tsx will handle the rest
      } catch (error: any) {
        console.error("Email/Password Auth Error", error);
        toast.error(error.message || "Authentication failed.");
      } finally {
        setDisabled(false);
      }
    }

    useEffect(() => {
      document.title = "PeekABoo"
      const unsubscribe = onAuthStateChanged(auth, (newLoginUser) => {
        setUser(newLoginUser)
      })
      return () => unsubscribe();
    }, [setUser])

    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">{isSignUp ? "Create an account" : "Welcome back"}</CardTitle>
            <CardDescription>
              {isSignUp ? "Enter your details to sign up." : "Enter your credentials to sign in."}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleEmailAuth}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={disabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={disabled}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={disabled}>
                {disabled && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSignUp ? "Sign Up" : "Sign In"}
              </Button>
              <Button variant="outline" type="button" className="w-full" onClick={signInWithGoogle} disabled={disabled}>
                {disabled && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in with Google
              </Button>
            </CardFooter>
          </form>
          <div className="p-6 pt-0 text-center text-sm">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <Button variant="link" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Sign In" : "Sign Up"}
            </Button>
          </div>
        </Card>
      </div>
    )
}

export default AuthComponent
