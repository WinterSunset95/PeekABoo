import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FriendsListComponent from '../components/FriendsListComponent';
import { UserContext } from '../App';
import { app } from '../lib/firebase';
import { Friend, UserData } from '../lib/models';
import { collection, getDoc, getFirestore, query, where, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Loader2 } from 'lucide-react';

const HomePage: React.FC = () => {
  const [friends, setFriend] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
  const { user } = useContext(UserContext)

  const errorMessage = (msg: string) => {
    toast.error(msg);
  }

  useEffect(() => {
    if (user) {
      const db = getFirestore(app);
      const friendsRef = collection(db, 'users', user.uid, 'friends');

      // Listener for friends
      const friendsQuery = query(friendsRef, where("status", "==", "friends"));
      const unsubscribeFriends = onSnapshot(friendsQuery, (snapshot) => {
        const friendsList = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Friend));
        setFriend(friendsList);
      }, (error) => {
        console.error("Error listening to friends:", error);
        errorMessage("Error loading friends.");
      });

      // Listener for friend requests
      const requestsQuery = query(friendsRef, where("status", "==", "received_pending"));
      const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
        const requestsList = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Friend));
        setFriendRequests(requestsList);
      }, (error) => {
        console.error("Error listening to friend requests:", error);
        errorMessage("Error loading friend requests.");
      });

      // Cleanup listeners on component unmount or user change
      return () => {
        unsubscribeFriends();
        unsubscribeRequests();
      };
    } else {
      // Clear social data when user logs out
      setFriend([]);
      setFriendRequests([]);
    }
  }, [user])

  useEffect(() => {
    document.title = "PeekABoo"
  }, [])


  const handleAcceptRequest = async (friendUid: string) => {
    if (!user) return;
    try {
      const db = getFirestore(app);
      const now = Date.now();
      
      // Update current user's friend document
      const currentUserFriendRef = doc(db, 'users', user.uid, 'friends', friendUid);
      await updateDoc(currentUserFriendRef, { status: 'friends', since: now });
  
      // Update the other user's friend document
      const otherUserFriendRef = doc(db, 'users', friendUid, 'friends', user.uid);
      await updateDoc(otherUserFriendRef, { status: 'friends', since: now });
  
    } catch (error) {
      console.error("Error accepting friend request:", error);
      errorMessage("Failed to accept friend request.");
    }
  };

  const handleDeclineRequest = async (friendUid: string) => {
    if (!user) return;
    try {
      const db = getFirestore(app);
      
      // Delete from current user's friend list
      const currentUserFriendRef = doc(db, 'users', user.uid, 'friends', friendUid);
      await deleteDoc(currentUserFriendRef);
      
      // Delete from the other user's friend list
      const otherUserFriendRef = doc(db, 'users', friendUid, 'friends', user.uid);
      await deleteDoc(otherUserFriendRef);
  
    } catch (error) {
      console.error("Error declining friend request:", error);
      errorMessage("Failed to decline friend request.");
    }
  };

  const FriendRequestItem: React.FC<{ request: Friend; }> = ({ request }) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const db = getFirestore(app);
          const userRef = doc(db, 'users', request.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
          setUserData(userSnap.data() as UserData);
          }
        } catch (error) {
          console.error("Error fetching user data for request:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }, [request.uid]);
    
    if (loading) {
      return (
      <div className="flex items-center p-2">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span>Loading request...</span>
      </div>
      );
    }
    
    if (!userData) return null;
    
    return (
      <div className="flex items-center p-2 rounded-lg hover:bg-muted">
        <Avatar>
          <AvatarImage src={userData.photoURL} alt={userData.displayName} />
          <AvatarFallback>{userData.displayName?.[0]}</AvatarFallback>
        </Avatar>
        <div className="ml-4 flex-grow">
          <h2 className="font-semibold">{userData.displayName}</h2>
          <p className="text-sm text-muted-foreground">Wants to be your friend.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleAcceptRequest(request.uid)}>
            <Check className="h-5 w-5 text-green-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDeclineRequest(request.uid)}>
            <X className="h-5 w-5 text-red-500" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="flex items-center justify-between p-2 border-b sticky top-0 bg-background z-10">
        <h1 className="text-xl font-bold">Peek-A-Boo</h1>
        {user ? (
          <Link to="/settings">
            <Avatar className="cursor-pointer">
              <AvatarImage src={user.photoURL ?? ""} alt={user.displayName ?? ""} />
              <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        )}
      </header>
      <main className="p-4 space-y-8">
        {friendRequests.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Friend Requests</h2>
            <div className="space-y-2">
              {friendRequests.map(req => (
                <FriendRequestItem
                  key={req.uid}
                  request={req}
                />
              ))}
            </div>
          </section>
        )}
        <section>
          <h2 className="text-2xl font-bold mb-4">Friends</h2>
          <FriendsListComponent friends={friends} />
        </section>
      </main>
    </>
  )
}

export default HomePage
