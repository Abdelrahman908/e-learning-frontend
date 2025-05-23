import React, { useEffect, useState } from "react";

// مثال: يمكنك استبدالها بـ axios إذا تفضل
const fetchUsers = async () => {
  const res = await fetch("https://localhost:7056/api/admin/users"); // غير الرابط حسب API عندك
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  return await res.json();
};

const deleteUserById = async (userId) => {
  const res = await fetch(`https://localhost:7056/api/admin/users/${userId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete user");
  }
  return true;
};

const UserRow = ({ user, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`هل أنت متأكد من حذف المستخدم: ${user.username} ؟`)) {
      onDelete(user.id);
    }
  };

  return (
    <tr>
      <td>{user.id}</td>
      <td>{user.username}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>
        <button
          onClick={handleDelete}
          className="btn btn-danger"
          title="حذف المستخدم"
        >
          حذف
        </button>
      </td>
    </tr>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message || "حدث خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await deleteUserById(userId);
      // تحديث القائمة بعد الحذف
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      alert(err.message || "فشل في حذف المستخدم");
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container p-4">
      <h2 className="mb-4">إدارة المستخدمين</h2>

      <input
        type="text"
        placeholder="ابحث بالاسم..."
        className="form-control mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && <p>جاري تحميل المستخدمين...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>معرف</th>
              <th>اسم المستخدم</th>
              <th>البريد الإلكتروني</th>
              <th>الدور</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  لا يوجد مستخدمين مطابقين
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <UserRow key={user.id} user={user} onDelete={handleDelete} />
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;
