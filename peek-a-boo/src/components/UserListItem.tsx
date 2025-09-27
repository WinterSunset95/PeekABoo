import React from 'react';
import { UserData } from '../lib/models';
import { IonItem, IonLabel, IonAvatar } from '@ionic/react';

interface UserListItemProps {
  user: UserData;
}

const UserListItem: React.FC<UserListItemProps> = ({ user }) => {
  return (
    <IonItem routerLink={`/user/${user.uid}`}>
      <IonAvatar slot="start">
        <img src={user.photoURL} alt={user.displayName} />
      </IonAvatar>
      <IonLabel>
        <h2>{user.displayName}</h2>
        <p>{user.email}</p>
      </IonLabel>
    </IonItem>
  );
};

export default UserListItem;
