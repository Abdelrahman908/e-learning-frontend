import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { updateProfile } from '../../services/auth';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ToastContainer from '../../components/ui/ToastContainer';
import useToast from '../../hooks/useToast';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: null,
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: null,
      });
      setPreview(user.avatar || '');
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('phone', formData.phone);
      if (formData.avatar) {
        formPayload.append('avatar', formData.avatar);
      }

      await updateProfile(formPayload);
      addToast('تم تحديث الملف الشخصي بنجاح', 'success');
    } catch (error) {
      console.error('Profile update failed:', error);
      addToast('فشل في تحديث الملف الشخصي', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <LoadingSpinner fullscreen />;

  return (
    <div className="container py-4">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card p-3 text-center">
            <Avatar 
              src={preview} 
              alt={user.name} 
              size="xl" 
              className="mx-auto mb-3"
            />
            <h4>{user.name}</h4>
            <p className="text-muted">{user.email}</p>
            
            <div className="mt-3">
              <label className="btn btn-outline-primary btn-sm">
                تغيير الصورة
                <input 
                  type="file" 
                  className="d-none" 
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card p-4">
            <h3 className="mb-4">تعديل الملف الشخصي</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">الاسم الكامل</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">البريد الإلكتروني</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label">رقم الهاتف</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <Button 
                type="submit" 
                loading={loading}
                className="w-100 mt-3"
              >
                حفظ التغييرات
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;