import { Card, Button, Space, Typography, Popconfirm } from 'antd';

const ProfileView = ({ profile, onEdit, onDelete }) => {
  return (
    <Card title="الملف الشخصي" style={{ marginBottom: 20 }}>
      <Space direction="vertical" size="middle">
        <Typography.Text><b>الاسم:</b> {profile.userName}</Typography.Text>
        <Typography.Text><b>البريد:</b> {profile.email}</Typography.Text>
        <Typography.Text><b>الهاتف:</b> {profile.phone}</Typography.Text>
        <Typography.Text><b>العنوان:</b> {profile.address}</Typography.Text>
        <Typography.Text><b>نبذة:</b> {profile.bio}</Typography.Text>
        {profile.profilePicture && (
          <img
            src={profile.profilePicture}
            alt="الصورة الشخصية"
            style={{ maxWidth: 150, borderRadius: 10 }}
          />
        )}
        <Space>
          <Button onClick={onEdit}>تعديل</Button>
          <Popconfirm title="هل أنت متأكد؟" onConfirm={onDelete}>
            <Button danger>حذف</Button>
          </Popconfirm>
        </Space>
      </Space>
    </Card>
  );
};

export default ProfileView;
