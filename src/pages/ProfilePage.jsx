import { useEffect, useState } from 'react';
import { Card, Spin, message, Alert, Divider } from 'antd';
import ProfileService from '../services/profile';
import ProfileView from '../components/ProfileView';
import ProfileForm from '../components/ProfileForm';
import ProfilePictureUploader from '../components/ProfilePictureUploader';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await ProfileService.getMyProfile();
      setProfile(data);
    } catch (err) {
      console.error("❌ Error fetching profile:", err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await ProfileService.delete();
      message.success('تم حذف البروفايل');
      setProfile(null);
    } catch (err) {
      message.error('فشل في حذف البروفايل');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '40px auto',
        padding: '0 16px',
      }}
    >
      <Card
        title={<h2 style={{ marginBottom: 0, color: '#1890ff' }}>إدارة البروفايل</h2>}
        bordered={false}
        style={{
          borderRadius: 12,
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
        }}
      >
        <Spin spinning={loading} tip="جارٍ تحميل البيانات..." size="large">
          {!loading && profile && !isEditing && (
            <>
              <ProfileView
                profile={profile}
                onEdit={() => setIsEditing(true)}
                onDelete={handleDelete}
              />
              <Divider style={{ margin: '24px 0' }} />
              <ProfilePictureUploader onUpload={fetchProfile} />
            </>
          )}

          {!loading && isEditing && (
            <ProfileForm
              initialValues={profile}
              onSuccess={() => {
                setIsEditing(false);
                fetchProfile();
              }}
              onCancel={() => setIsEditing(false)}
            />
          )}

          {!loading && !profile && (
            <>
              <Alert
                message="لا يوجد بروفايل، يمكنك إنشاؤه الآن."
                type="info"
                showIcon
                style={{ marginBottom: 24, borderRadius: 8 }}
              />
              <ProfileForm onSuccess={fetchProfile} />
            </>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default ProfilePage;
