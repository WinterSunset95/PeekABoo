import React, { useEffect, useState } from 'react';
import { Friend, UserData } from '../lib/models';
import { IonList, IonItem, IonLabel, IonAvatar, IonSpinner } from '@ionic/react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../lib/firebase';

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
        <IonItem>
            <IonSpinner name="crescent" slot="start"></IonSpinner>
            <IonLabel>Loading friend...</IonLabel>
        </IonItem>
    )
  }

  if (!userData) {
    return null; // Don't render if user data could not be fetched
  }

  return (
    <IonItem>
      <IonAvatar slot="start">
        <img src={userData.photoURL} alt={userData.displayName} />
      </IonAvatar>
      <IonLabel>
        <h2>{userData.displayName}</h2>
        <p>Friends since {new Date(friend.since).toLocaleDateString()}</p>
      </IonLabel>
    </IonItem>
  );
};

interface FriendsListComponentProps {
  friends: Friend[];
}

const FriendsListComponent: React.FC<FriendsListComponentProps> = ({ friends }) => {
  if (friends.length === 0) {
    return <p>You have no friends yet.</p>;
  }

  return (
    <IonList>
      {friends.map(friend => (
        <FriendItem key={friend.uid} friend={friend} />
      ))}
    </IonList>
  );
};

export default FriendsListComponent;
