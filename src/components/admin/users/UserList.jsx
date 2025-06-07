import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserService from '../../../services/users';
import UserFilter from './UserFilter';
import UserCard from './UserCard';
import { Button, LoadingSpinner } from '../../ui';
import { Plus, RefreshCw } from 'lucide-react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.page,
        pageSize: pagination.pageSize
      };
      const data = await UserService.getAll(params);

      // ✅ Normalize users to ensure compatibility with component props
      const normalized = (data.items || data).map(u => ({
        id: u.id || u.Id,
        fullName: u.fullName || u.FullName || "---",
        email: u.email || u.Email || "---",
        role: u.role || u.Role || "---",
        avatarUrl: u.avatarUrl || u.AvatarUrl || null
      }));

      setUsers(normalized);
      setPagination(prev => ({ ...prev, total: data.total || 0 }));
    } catch (error) {
      toast.error(error.message || 'حدث خطأ أثناء تحميل المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters, pagination.page]);

  const handleCreate = () => {
    navigate('/admin/users/create');
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">إدارة المستخدمين</h1>
        <div className="flex gap-2">
          <Button 
            variant="primary" 
            onClick={handleCreate}
            icon={<Plus size={18} />}
          >
            مستخدم جديد
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleRefresh}
            icon={<RefreshCw size={18} />}
          >
            تحديث
          </Button>
        </div>
      </div>

      <UserFilter onFilter={setFilters} />

      {loading ? (
        <div className="flex justify-center my-8">
          <LoadingSpinner />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          لا يوجد مستخدمين متاحين
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {users.map(user => (
            <UserCard 
              key={user.id} 
              user={user} 
              onDelete={fetchUsers}
            />
          ))}
        </div>
      )}

      {/* ✅ يمكنك لاحقًا إضافة Pagination هنا */}
    </div>
  );
};

export default UserList;
