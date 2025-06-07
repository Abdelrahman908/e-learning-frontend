import React from 'react';
import UserList from '../../components/admin/users/UserList';

const UsersPage = () => {
  return (
    <div className="flex-1 overflow-auto">
      <UserList />
    </div>
  );
};

export default UsersPage;