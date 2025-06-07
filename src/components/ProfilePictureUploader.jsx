import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ProfileService from '../services/profile';

const ProfilePictureUploader = ({ onUpload }) => {
  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await ProfileService.uploadPicture(formData);
      message.success('تم رفع الصورة بنجاح');
      onUpload?.();
    } catch (err) {
      message.error('فشل رفع الصورة');
    }
  };

  return (
    <Upload customRequest={handleUpload} showUploadList={false}>
      <Button icon={<UploadOutlined />}>رفع صورة</Button>
    </Upload>
  );
};

export default ProfilePictureUploader;
