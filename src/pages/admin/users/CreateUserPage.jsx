import React from 'react';
import { useParams } from 'react-router-dom';
import UserForm from '../../../components/admin/users/UserForm';

const EditUserPage = () => {
  const { id } = useParams();
  return (
    <div className="flex-1 overflow-auto">
      <UserForm id={id} />
    </div>
  );
};

export default EditUserPage;