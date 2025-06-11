import { Upload, Button, message, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ProfileService from '../services/profile';
import { useState, useEffect } from 'react';

const ProfilePictureUploader = ({ onUpload }) => {
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    // تحميل البروفايل لجلب الصورة الحالية
    const fetchProfile = async () => {
      try {
        const { data } = await ProfileService.getMyProfile();
        setProfilePicture(data.profilePicture);
      } catch (err) {
        console.error("فشل في تحميل صورة البروفايل", err);
      }
    };

    fetchProfile();
  }, []);

  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append('file', file.originFileObj); // ✅ مهم جدًا

    try {
      await ProfileService.uploadPicture(formData);
      message.success('تم رفع الصورة بنجاح');
      onUpload?.();
      // إعادة تحميل الصورة الجديدة
      const { data } = await ProfileService.getMyProfile();
      setProfilePicture(data.profilePicture);
    } catch (err) {
      console.error("❌ فشل رفع الصورة:", err);
      message.error('فشل رفع الصورة');
    }
  };

  return (
    <div className="text-center mt-4">
      {profilePicture && (
        <div className="mb-4">
          <Image
            width={150}
            src={profilePicture}
            alt="صورة البروفايل"
            style={{ borderRadius: '50%' }}
          />
        </div>
      )}

      <Upload customRequest={handleUpload} showUploadList={false}>
        <Button icon={<UploadOutlined />}>
          {profilePicture ? 'تغيير الصورة' : 'رفع صورة'}
        </Button>
      </Upload>
    </div>
  );
};

export default ProfilePictureUploader;
