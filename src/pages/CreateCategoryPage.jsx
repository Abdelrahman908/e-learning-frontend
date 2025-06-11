// src/pages/CreateCategoryPage.jsx
import React, { useState } from 'react';
import { Layout, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import CategoryForm from '../components/CategoryForm';
import CategoryService from '../services/categories';
import Header from '../components/layout/Header';

const { Content } = Layout;

const CreateCategoryPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await CategoryService.create(values);
      message.success('تم إنشاء التصنيف بنجاح');
      navigate('/admin/categories');
    } catch (error) {
      message.error(error.message || 'حدث خطأ أثناء إنشاء التصنيف');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Header />
      <Content className="p-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">إضافة تصنيف جديد</h2>
          <CategoryForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </Content>
    </Layout>
  );
};

export default CreateCategoryPage;
