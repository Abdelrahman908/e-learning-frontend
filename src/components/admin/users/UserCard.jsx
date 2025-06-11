import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../contexts/AuthContext';
import UserService from '../../../services/users';
import ModalConfirm from '../../ui/ModalConfirm';

const UserCard = ({ user, onDelete }) => {
  const { user: currentUser } = useContext(AuthContext);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const isAdmin = currentUser?.role === 'Admin';

  const handleDelete = async () => {
    try {
      await UserService.delete(user.id);
      toast.success('تم حذف المستخدم بنجاح');
      onDelete();
    } catch (error) {
      toast.error(error.message || 'حدث خطأ أثناء الحذف');
    } finally {
      setShowConfirm(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/admin/users/${user.id}`);
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-600';
      case 'Instructor':
        return 'bg-blue-100 text-blue-600';
      case 'Student':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 p-4 flex flex-col justify-between h-full cursor-pointer"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="text-gray-400" size={24} />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-800 break-words leading-tight">
              {user.fullName}
            </h3>
            <p className="text-sm text-gray-600 break-all">{user.email}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4">
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${getRoleStyle(
              user.role
            )}`}
          >
            {user.role}
          </span>

          {  (
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <Link to={`/admin/users/edit/${user.id}`}>
                <button
                  className="p-1.5 rounded-full hover:bg-blue-100 bg-blue-50 border border-blue-200 shadow-sm transition"
                  title="تعديل"
                >
                  <Edit className="text-blue-600" size={16} />
                </button>
              </Link>
              <button
                onClick={() => setShowConfirm(true)}
                className="p-1.5 rounded-full hover:bg-red-100 bg-red-50 border border-red-200 shadow-sm transition"
                title="حذف"
              >
                <Trash2 className="text-red-600" size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {showConfirm && (
        <ModalConfirm
          title="تأكيد الحذف"
          message={`هل تريد حذف المستخدم ${user.fullName}؟`}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
};

export default UserCard;
