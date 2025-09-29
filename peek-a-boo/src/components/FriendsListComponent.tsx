import React, { useEffect, useState } from 'react';
import { Friend, UserData } from '../lib/models';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Loader2 } from 'lucide-react';

interface FriendItemProps {
  friend: Friend;
}

const FriendItem: React.FC<FriendItemProps> = ({ friend }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const db = getFirestore(app);
        const userRef = doc(db, 'users', friend.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data() as UserData);
        } else {
          console.warn(`User document not found for uid: ${friend.uid}`);
        }
      } catch (error) {
        console.error("Error fetching friend's user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [friend.uid]);

  if (loading) {
    return (
      <div className="flex items-center p-2">
        <Loader2 className="h-5 w-5 animate-spin mr-3" />
        <span>Loading friend...</span>
      </div>
    )
  }

  if (!userData) {
    return null; // Don't render if user data could not be fetched
  }

  return (
    <Link to={`/chat/${friend.uid}`} className="flex items-center p-2 rounded-lg transition-colors hover:bg-muted">
      <Avatar>
        <AvatarImage src={userData.photoURL} alt={userData.displayName} />
        <AvatarFallback>{userData.displayName?.[0]}</AvatarFallback>
      </Avatar>
      <div className="ml-4">
        <h2 className="font-semibold">{userData.displayName}</h2>
        <p className="text-sm text-muted-foreground">Friends since {new Date(friend.since).toLocaleDateString()}</p>
      </div>
    </Link>
  );
};

interface FriendsListComponentProps {
  friends: Friend[];
}

const FriendsListComponent: React.FC<FriendsListComponentProps> = ({ friends }) => {
  if (friends.length === 0) {
    return <p className="text-center text-muted-foreground">You have no friends yet.</p>;
  }

  return (
    <div className="space-y-2">
      {friends.map(friend => (
        <FriendItem key={friend.uid} friend={friend} />
      ))}
    </div>
  );
};

export default FriendsListComponent;
