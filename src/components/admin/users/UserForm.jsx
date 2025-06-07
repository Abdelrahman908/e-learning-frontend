import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../../services/users';
import { toast } from 'react-toastify';
import {
  TextField,
  MenuItem,
  Button,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  role: '',
};

const UserForm = ({ id }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(!!id); // لو فيه id يبقى جلب بيانات
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const isEdit = !!id;

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await UserService.getById(id);
        setForm({
          fullName: data.fullName,
          email: data.email,
          role: data.role,
          password: '', // لا نظهر كلمة المرور
        });
      } catch (err) {
        toast.error(err.message || 'فشل في تحميل بيانات المستخدم');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadUser();
    }
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await UserService.update(id, {
          fullName: form.fullName,
          email: form.email,
          role: form.role,
        });
        toast.success('تم تعديل المستخدم بنجاح');
      } else {
        await UserService.create(form);
        toast.success('تم إنشاء المستخدم بنجاح');
      }
      navigate('/admin/users');
    } catch (err) {
      toast.error(err.message || 'حدث خطأ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CircularProgress className="m-4" />;

  return (
    <Paper sx={{ p: 3, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h6" mb={2}>
        {isEdit ? 'تعديل مستخدم' : 'مستخدم جديد'}
      </Typography>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label="الاسم الكامل"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="البريد الإلكتروني"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          required
        />
        {!isEdit && (
          <TextField
            label="كلمة المرور"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            required
          />
        )}
        <TextField
          select
          label="الدور"
          name="role"
          value={form.role}
          onChange={handleChange}
          fullWidth
          required
        >
          <MenuItem value="Admin">أدمن</MenuItem>
          <MenuItem value="Instructor">مدرس</MenuItem>
          <MenuItem value="Student">طالب</MenuItem>
        </TextField>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={saving}
        >
          {saving ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إنشاء'}
        </Button>
      </form>
    </Paper>
  );
};

export default UserForm;
