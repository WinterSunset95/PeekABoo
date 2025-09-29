import { Link, useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { UserData } from "../lib/models";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { app } from "../lib/firebase";
import { UserContext } from "../App";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, ArrowLeft } from "lucide-react";

function UserPage() {
  const { id: userId } = useParams<{ id: string }>();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [friendStatus, setFriendStatus] = useState<'loading' | 'not_friends' | 'sent_pending' | 'received_pending' | 'friends'>('loading');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!userId) return;

    if (user?.uid === userId) {
      navigate('/settings', { replace: true });
      return;
    }

    const fetchUserDataAndStatus = async () => {
      setLoading(true);
      try {
        const db = getFirestore(app);
        // Fetch profile user data
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setProfileUser({ uid: userSnap.id, ...userSnap.data() } as UserData);
        } else {
          console.warn(`User document not found for uid: ${userId}`);
          setProfileUser(null);
          setLoading(false);
          return;
        }

        // Fetch friendship status
        if (user) {
          const friendRef = doc(db, 'users', user.uid, 'friends', userId);
          const friendSnap = await getDoc(friendRef);
          if (friendSnap.exists()) {
            setFriendStatus(friendSnap.data().status as 'sent_pending' | 'received_pending' | 'friends');
            console.log(friendSnap.data().status)
          } else {
            setFriendStatus('not_friends');
          }
        } else {
          setFriendStatus('not_friends'); // Not logged in, can't be friends
        }

      } catch (error) {
        console.error("Error fetching user data or friend status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndStatus();
  }, [userId, user]);

  const handleAddFriend = async () => {
    if (!user || !profileUser || isProcessing) return;

    setIsProcessing(true);
    try {
      const db = getFirestore(app);
      const now = Date.now();

      // For the sender
      const sentRequestData = { status: 'sent_pending', since: now, uid: profileUser.uid };
      const currentUserFriendRef = doc(db, 'users', user.uid, 'friends', profileUser.uid);
      await setDoc(currentUserFriendRef, sentRequestData);

      // For the recipient
      const receivedRequestData = { status: 'received_pending', since: now, uid: user.uid };
      const profileUserFriendRef = doc(db, 'users', profileUser.uid, 'friends', user.uid);
      await setDoc(profileUserFriendRef, receivedRequestData);

      setFriendStatus('sent_pending');
    } catch (error) {
      console.error("Error adding friend:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptFriend = async () => {
    if (!user || !profileUser || isProcessing) return;

    setIsProcessing(true);
    try {
      const db = getFirestore(app);
      const now = Date.now();
      const friendData = { status: 'friends', since: now };

      // Update current user's friend document
      const currentUserFriendRef = doc(db, 'users', user.uid, 'friends', profileUser.uid);
      await updateDoc(currentUserFriendRef, friendData);

      // Update the other user's friend document
      const otherUserFriendRef = doc(db, 'users', profileUser.uid, 'friends', user.uid);
      await updateDoc(otherUserFriendRef, friendData);
      
      setFriendStatus('friends');
    } catch (error) {
      console.error("Error accepting friend:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-full pt-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
    }

    if (!profileUser) {
      return <div className="text-center text-muted-foreground pt-16">User not found.</div>;
    }

    return (
      <div className="flex flex-col items-center pt-8">
        <Avatar className="w-24 h-24 border-4 border-primary">
          <AvatarImage src={profileUser.photoURL} alt={profileUser.displayName} />
          <AvatarFallback>{profileUser.displayName?.[0]}</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold mt-4">{profileUser.displayName}</h1>
        <p className="text-muted-foreground">{profileUser.email}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Member since {new Date(profileUser.createdAt).toLocaleDateString()}
        </p>

        <div className="mt-6 w-full max-w-xs space-y-2">
          <Button
            className="w-full"
            onClick={() => {
              if (friendStatus === 'not_friends') handleAddFriend();
              else if (friendStatus === 'received_pending') handleAcceptFriend();
            }}
            disabled={
              (friendStatus !== 'not_friends' && friendStatus !== 'received_pending') ||
              isProcessing ||
              !user
            }
          >
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {!user ? 'Login to Add Friend' :
              friendStatus === 'sent_pending' ? 'Request Sent' :
              friendStatus === 'received_pending' ? 'Accept Request' :
              friendStatus === 'friends' ? 'Friends' :
              'Add Friend'
            }
          </Button>
          <Button variant="destructive" className="w-full" disabled>
            Block User
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="flex items-center p-2 border-b bg-background sticky top-0 z-10">
        <Link to="/search">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <h1 className="text-lg font-bold truncate ml-2">{profileUser?.displayName || 'User Profile'}</h1>
      </header>
      <main className="p-4">
        {renderContent()}
      </main>
    </>
  )
}

export default UserPage
