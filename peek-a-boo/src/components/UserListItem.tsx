import React from 'react';
import { UserData } from '../lib/models';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserListItemProps {
  user: UserData;
}

const UserListItem: React.FC<UserListItemProps> = ({ user }) => {
  return (
    <Link to={`/user/${user.uid}`} className="flex items-center p-2 rounded-lg transition-colors hover:bg-muted">
      <Avatar>
        <AvatarImage src={user.photoURL} alt={user.displayName} />
        <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
      </Avatar>
      <div className="ml-4">
        <h2 className="font-semibold text-foreground">{user.displayName}</h2>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
    </Link>
  );
};

export default UserListItem;
