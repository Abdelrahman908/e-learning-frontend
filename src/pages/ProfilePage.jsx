import { useEffect, useState } from 'react';
import { Card, Spin, message } from 'antd';
import ProfileService from '../services/profile';
import ProfileView from '../components/ProfileView';
import ProfileForm from '../components/ProfileForm';
import ProfilePictureUploader from '../components/ProfilePictureUploader';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    console.log("🔄 fetchProfile called");
    setLoading(true);
    try {
      const { data } = await ProfileService.getMyProfile();
      console.log("✅ Profile data received:", data);
      setProfile(data);
    } catch (err) {
      console.error("❌ Error fetching profile:", err);
      setProfile(null);
    } finally {
      setLoading(false);
      console.log("✅ Loading set to false");
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
    console.log("📦 useEffect triggered - component mounted");
    fetchProfile();
  }, []);

  console.log("🧪 Rendering ProfilePage - loading:", loading, "| profile:", profile);

{!profile && !loading && (
  <Alert message="لا يوجد بروفايل" type="info" showIcon />
)}

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <Card title="إدارة البروفايل">
        {profile && !isEditing && (
          <>
            <ProfileView
              profile={profile}
              onEdit={() => setIsEditing(true)}
              onDelete={handleDelete}
            />
            <ProfilePictureUploader onUpload={fetchProfile} />
          </>
        )}
        {isEditing && (
          <ProfileForm
            initialValues={profile}
            onSuccess={() => {
              setIsEditing(false);
              fetchProfile();
            }}
          />
        )}
        {!profile && (
          <ProfileForm
            onSuccess={fetchProfile}
          />
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;
