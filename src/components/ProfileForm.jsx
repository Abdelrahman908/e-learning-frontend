import { useState } from 'react';
import { Button, Input, Form, message } from 'antd';
import ProfileService from '../services/profile';

const ProfileForm = ({ initialValues = {}, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const isEdit = !!initialValues?.id;

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (isEdit) {
        await ProfileService.update(values);
        message.success('تم تحديث البروفايل');
      } else {
        await ProfileService.create(values);
        message.success('تم إنشاء البروفايل');
      }
      onSuccess();
    } catch (err) {
      message.error(err?.response?.data || 'فشل في العملية');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Form.Item name="bio" label="نبذة">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item name="address" label="العنوان">
        <Input />
      </Form.Item>
      <Form.Item name="phone" label="رقم الهاتف">
        <Input />
      </Form.Item>
      {isEdit && (
        <>
          <Form.Item name="fullName" label="الاسم الكامل">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="البريد الإلكتروني">
            <Input type="email" />
          </Form.Item>
        </>
      )}
      <Button type="primary" htmlType="submit" loading={loading}>
        {isEdit ? 'تحديث' : 'إنشاء'}
      </Button>
    </Form>
  );
};

export default ProfileForm;
