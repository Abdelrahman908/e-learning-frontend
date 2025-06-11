import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../../services/users';
import { message, Form, Input, Button, Select, Card } from 'antd';

const { Option } = Select;

const CreateUserPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

const onFinish = async (values) => {
  try {
    const payload = {
      FullName: values.fullName,
      Email: values.email,
      Password: values.password,
      Role: values.role
    };

    console.log("Sending:", payload); // تحقق من شكل البيانات

    await UserService.create(payload);
    message.success("تم إنشاء المستخدم بنجاح");
    navigate("/admin/users");
  } catch (error) {
    console.error("Create user error:", error?.response?.data || error.message);
    message.error(error.message || "فشل في إنشاء المستخدم");
  }
};



  return (
    <Card title="إنشاء مستخدم جديد" className="max-w-xl mx-auto mt-10">
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="fullName"
          label="الاسم الكامل"
          rules={[{ required: true, message: 'يرجى إدخال الاسم الكامل' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="البريد الإلكتروني"
          rules={[{ required: true, message: 'يرجى إدخال البريد الإلكتروني' }]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="كلمة المرور"
          rules={[{ required: true, message: 'يرجى إدخال كلمة المرور' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="role"
          label="الدور"
          rules={[{ required: true, message: 'يرجى اختيار الدور' }]}
        >
          <Select placeholder="اختر الدور">
            <Option value="Admin">مسؤول</Option>
            <Option value="Instructor">مدرّس</Option>
            <Option value="Student">طالب</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            إنشاء
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateUserPage;
