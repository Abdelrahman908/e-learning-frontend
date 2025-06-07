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
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useAuth from '../../hooks/useAuth';

const { TextArea } = Input;
const { Option } = Select;

const CourseForm = ({ initialValues, onSubmit, isEdit = false, categories = [] }) => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

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
    return isImage && isLt2M;
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onFinish = async (values) => {
    if (!user) {
      message.error('المستخدم غير معروف، يرجى تسجيل الدخول مجددًا');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      formData.append('Name', values.name);
      formData.append('Title', values.title?.trim() || '');
      formData.append('Description', values.description);
      formData.append('Price', values.price);
      formData.append('IsActive', values.isActive);
      formData.append('CategoryId', values.categoryId);
      formData.append('InstructorId', user?.sub || user?.userId);

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('ImageFile', fileList[0].originFileObj);
      }

      await onSubmit(formData);
      message.success(`تم ${isEdit ? 'تحديث' : 'إنشاء'} الكورس بنجاح`);
    } catch (error) {
      message.error(error?.response?.data?.message || 'حدث خطأ ما');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        isActive: true,
        ...initialValues,
      }}
    >
      <Form.Item
        name="name"
        label="اسم الكورس"
        rules={[{ required: true, message: 'الرجاء إدخال اسم الكورس' }]}
      >
        <Input placeholder="أدخل اسم الكورس" />
      </Form.Item>

      <Form.Item name="title" label="العنوان">
        <Input placeholder="أدخل العنوان" />
      </Form.Item>

      <Form.Item
        name="description"
        label="الوصف"
        rules={[{ required: true, message: 'الرجاء إدخال وصف الكورس' }]}
      >
        <TextArea rows={4} placeholder="أدخل وصفًا للكورس" />
      </Form.Item>

      <Form.Item
        name="price"
        label="السعر"
        rules={[{ required: true, message: 'الرجاء إدخال السعر' }]}
      >
        <InputNumber
          min={0}
          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name="categoryId"
        label="التصنيف"
        rules={[{ required: true, message: 'الرجاء اختيار تصنيف' }]}
      >
        <Select placeholder="اختر التصنيف">
          {categories.map((cat) => (
            <Option key={cat.id} value={cat.id}>
              {cat.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="isActive" label="نشط" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="صورة الكورس">
        <Upload
          listType="picture"
          fileList={fileList}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          maxCount={1}
          accept="image/*"
          customRequest={({ file, onSuccess }) => {
            setTimeout(() => {
              onSuccess('ok');
            }, 0);
          }}
        >
          <Button icon={<UploadOutlined />}>رفع صورة</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {isEdit ? 'تحديث الكورس' : 'إنشاء الكورس'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CourseForm;
