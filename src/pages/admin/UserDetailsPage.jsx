import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserService from "../../services/users";
import { ArrowLeft, User } from "lucide-react";
import { Button, LoadingSpinner } from "@/components/ui";
import { toast } from "react-toastify";

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const data = await UserService.getById(id);
      setUser(data);
    } catch (error) {
      toast.error(error.message || "فشل في تحميل بيانات المستخدم");
      navigate("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return null;

  const getRoleStyle = (role) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-600";
      case "Instructor":
        return "bg-blue-100 text-blue-600";
      case "Student":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">تفاصيل المستخدم</h1>
        <Button onClick={() => navigate(-1)} variant="secondary" size="sm">
          <ArrowLeft className="mr-2" size={16} />
          رجوع
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6 max-w-md mx-auto">
        <div className="flex items-center justify-center mb-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="text-gray-400" size={40} />
            )}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">{user.fullName}</h2>
          <p className="text-sm text-gray-500 break-words mt-1">{user.email}</p>
          <span
            className={`inline-block mt-3 text-xs px-3 py-1 rounded-full font-medium ${getRoleStyle(user.role)}`}
          >
            {user.role}
          </span>
        </div>

        <div className="mt-6 text-sm text-gray-600 space-y-2">
          <p>
            <strong>تاريخ الإنشاء:</strong>{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "غير متوفر"}
          </p>
          <p>
            <strong>الحالة:</strong> {user.isActive ? "مفعل" : "معطل"}
          </p>
          <p>
            <strong>تأكيد البريد:</strong>{" "}
            {user.isEmailConfirmed ? "تم" : "لم يتم"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
