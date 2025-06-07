import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '../../ui';
import UserService from '../../../services/users';

const UserActions = ({ user, onDeleted }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/admin/users/edit/${user.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('هل تريد حذف هذا المستخدم؟')) {
      try {
        await UserService.delete(user.id);
        toast.success('تم حذف المستخدم بنجاح');
        onDeleted();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        icon={<Edit size={16} />}
        onClick={handleEdit}
      >
        تعديل
      </Button>

      <Button
        size="sm"
        variant="destructive"
        icon={<Trash2 size={16} />}
        onClick={handleDelete}
      >
        حذف
      </Button>
    </div>
  );
};

export default UserActions;
