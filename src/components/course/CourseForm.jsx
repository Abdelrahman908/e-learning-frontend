import { useState, useEffect } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Switch,
  Select,
  Upload,
  Button,
  message,
  Card,
  Divider,
  Row,
  Col,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useAuth from '../../hooks/useAuth';
import CategoryService from '../../services/categories';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;

const CourseForm = ({ initialValues, onSubmit, isEdit = false, courseId }) => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoryService.getAll();
        setCategories(data);
      } catch (error) {
        message.error('فشل في جلب التصنيفات');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialValues?.imageUrl) {
      setFileList([
        {
          uid: '-1',
          name: 'صورة الكورس الحالية',
          status: 'done',
          url: initialValues.imageUrl,
        },
      ]);
    }
  }, [initialValues]);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isImage) {
      message.error('الملف يجب أن يكون صورة');
    }
    if (!isLt2M) {
      message.error('الصورة يجب أن تكون أقل من 2MB');
    }
    return isImage && isLt2M ? true : Upload.LIST_IGNORE;
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1)); // آخر صورة فقط
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();

      if (courseId) {
        formData.append('Id', courseId.toString());
      }

      formData.append('Name', values.name || '');
      formData.append('Title', values.title || '');
      formData.append('Description', values.description || '');
      formData.append('Price', values.price?.toString() || '0');
      formData.append('IsActive', values.isActive ? 'true' : 'false');
      formData.append('CategoryId', values.categoryId?.toString() || '1');

      if (user?.id) {
        formData.append('InstructorId', user.id.toString());
      } else {
        message.error('لا يمكن تحديد معرف المدرّس');
        return;
      }

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('ImageFile', fileList[0].originFileObj);
      }

      await onSubmit(formData);
      message.success(isEdit ? 'تم تحديث الكورس بنجاح' : 'تم إنشاء الكورس بنجاح');
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || 'حدث خطأ ما');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
  bordered={false}
  className="max-w-4xl mx-auto rounded-2xl shadow-md bg-gradient-to-br from-white via-gray-50 to-white"
  bodyStyle={{ padding: '2.5rem' }}
>
  <h2 className="text-2xl font-extrabold text-center text-gray-700 mb-8">
    {isEdit ? 'تعديل الكورس' : 'إضافة كورس جديد'}
  </h2>

  <Form
    form={form}
    layout="vertical"
    onFinish={onFinish}
    initialValues={{
      isActive: true,
      ...initialValues,
      categoryId: initialValues?.categoryId ?? undefined,
    }}
    scrollToFirstError
  >
    <Divider orientation="right" className="text-base text-gray-600">المعلومات الأساسية</Divider>

    <Row gutter={16}>
      <Col span={24}>
        <Form.Item
          name="name"
          label="اسم الكورس"
          rules={[{ required: true, message: 'الرجاء إدخال اسم الكورس' }]}
        >
          <Input size="large" placeholder="أدخل اسم الكورس" />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item name="title" label="العنوان">
          <Input size="large" placeholder="أدخل العنوان" />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          name="description"
          label="الوصف"
          rules={[{ required: true, message: 'الرجاء إدخال وصف الكورس' }]}
        >
          <TextArea rows={4} size="large" placeholder="أدخل وصفًا تفصيليًا للكورس" />
        </Form.Item>
      </Col>
    </Row>

    <Divider orientation="right" className="text-base text-gray-600">إعدادات الكورس</Divider>

    <Row gutter={16}>
      <Col xs={24} sm={12}>
        <Form.Item
          name="price"
          label="السعر"
          rules={[{ required: true, message: 'الرجاء إدخال السعر' }]}
        >
          <InputNumber
            min={0}
            size="large"
            style={{ width: '100%' }}
            formatter={(value) => `د.أ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/[^\d]/g, '')}
            placeholder="0"
          />
        </Form.Item>
      </Col>

      <Col xs={24} sm={12}>
        <Form.Item
          name="categoryId"
          label="التصنيف"
          rules={[{ required: true, message: 'الرجاء اختيار تصنيف' }]}
        >
          <Select
            placeholder="اختر التصنيف"
            size="large"
            loading={categories.length === 0}
            showSearch
            optionFilterProp="children"
          >
            {categories.map((cat) => (
              <Option key={cat.id} value={cat.id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col xs={24} sm={12}>
        <Form.Item name="isActive" label="نشط" valuePropName="checked">
          <Switch size="large" />
        </Form.Item>
      </Col>

      <Col xs={24} sm={12}>
        <Form.Item label="صورة الكورس">
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            maxCount={1}
            accept="image/*"
            customRequest={({ onSuccess }) => setTimeout(() => onSuccess('ok'), 0)}
            className="upload-style"
          >
            {fileList.length >= 1 ? null : (
              <div className="flex flex-col items-center justify-center text-gray-500">
                <UploadOutlined style={{ fontSize: '24px' }} />
                <div style={{ marginTop: 8 }}>رفع صورة</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Col>
    </Row>

    <Divider />

    <Row justify="space-between" gutter={16}>
      <Col>
        <Button
          type="default"
          size="large"
          onClick={() => navigate('/dashboard/my-courses')}
          className="rounded-full px-6"
        >
          إلغاء
        </Button>
      </Col>
      <Col>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={loading}
          className="rounded-full px-8 bg-blue-600 hover:bg-blue-700"
        >
          {isEdit ? 'تحديث الكورس' : 'إنشاء الكورس'}
        </Button>
      </Col>
    </Row>
  </Form>
</Card>

  );
};

export default CourseForm;
