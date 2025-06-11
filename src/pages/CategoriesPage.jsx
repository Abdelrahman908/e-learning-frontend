// src/pages/CategoriesPage.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import CategoryService from '../services/categories';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getWithCourses();

        const formatted = data.map(cat => ({
          id: cat.Id,
          name: cat.Name,
          courses: (cat.Courses || []).map(course => ({
            id: course.Id,
            name: course.Name,
            title: course.Title,
            price: course.Price,
            isFree: course.IsFree,
          })),
        }));

        setCategories(formatted);
      } catch (error) {
        console.error(error);
        message.error('فشل في تحميل التصنيفات');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const columns = [
    {
      title: 'اسم التصنيف',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'عدد الكورسات',
      key: 'courses',
      render: (_, record) => record.courses?.length || 0,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">كل التصنيفات</h2>
        <Button type="primary" onClick={() => navigate('/admin/categories/create')}>
          + إضافة تصنيف
        </Button>
      </div>

      <Table
        dataSource={categories}
        columns={columns}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
};

export default CategoriesPage;
