import { Form, Input, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

const CategoryForm = ({ onSubmit, loading }) => {
  const navigate = useNavigate();

  return (
    <Form layout="vertical" onFinish={onSubmit}>
      <Form.Item
        label="اسم التصنيف"
        name="name"
        rules={[
          { required: true, message: 'يرجى إدخال اسم التصنيف' },
          {
            validator: (_, value) => {
              if (value && value.trim().length === 0) {
                return Promise.reject('لا يمكن أن يحتوي الاسم على مسافات فقط');
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input placeholder="مثال: برمجة، إدارة، لغات..." />
      </Form.Item>

      <Form.Item
        label="الوصف"
        name="description"
      >
        <Input.TextArea rows={4} placeholder="وصف اختياري للتصنيف" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            حفظ
          </Button>
          <Button onClick={() => navigate('/admin/categories')}>
            رجوع للقائمة
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CategoryForm;
