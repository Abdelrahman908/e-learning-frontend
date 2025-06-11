import React, { useEffect, useState } from "react";
import {
  Card,
  Spin,
  message,
  Button,
  Descriptions,
  Avatar,
  Typography,
  Divider,
} from "antd";
import {
  EditOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import ProfileService from "../services/profile";
import ProfileForm from "../components/ProfileForm";

const { Title, Text } = Typography;

const MyProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data } = await ProfileService.getMyProfile();
      setProfile(data);
    } catch (err) {
      setProfile(null);
      message.warning("لا يوجد بروفايل بعد، يمكنك إنشاؤه.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSuccess = () => {
    setIsEditing(false);
    fetchProfile();
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 300,
        }}
      >
        <Spin tip="جارٍ تحميل بياناتك..." size="large" />
      </div>
    );
  }

  const imageUrl = profile?.profilePicture
    ? `https://localhost:7056${profile.profilePicture}`
    : null;

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: "0 16px",
        background:
          "radial-gradient(circle at top left, #e6f7ff, #ffffff 70%)",
        borderRadius: 20,
        boxShadow: "0 20px 40px rgba(24, 144, 255, 0.15)",
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Card
        title={
          <Title level={3} style={{ color: "#1890ff", marginBottom: 0 }}>
            {isEditing
              ? profile
                ? "تعديل الملف الشخصي"
                : "إنشاء الملف الشخصي"
              : "ملفي الشخصي"}
          </Title>
        }
        extra={
          isEditing ? (
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => setIsEditing(false)}
              style={{
                borderRadius: 8,
                fontWeight: "600",
                color: "#1890ff",
                borderColor: "#1890ff",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                Object.assign(e.currentTarget.style, {
                  backgroundColor: "#1890ff",
                  color: "white",
                })
              }
              onMouseLeave={(e) =>
                Object.assign(e.currentTarget.style, {
                  backgroundColor: "transparent",
                  color: "#1890ff",
                })
              }
            >
              إلغاء
            </Button>
          ) : (
            <Button
              icon={profile ? <EditOutlined /> : <PlusOutlined />}
              onClick={() => setIsEditing(true)}
              type="primary"
              style={{
                borderRadius: 8,
                fontWeight: "700",
                background:
                  "linear-gradient(45deg, #40a9ff, #1890ff, #096dd9)",
                border: "none",
                boxShadow:
                  "0 4px 15px rgba(24, 144, 255, 0.6)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
              onMouseEnter={(e) =>
                Object.assign(e.currentTarget.style, {
                  transform: "scale(1.05)",
                  boxShadow:
                    "0 8px 30px rgba(24, 144, 255, 0.85)",
                })
              }
              onMouseLeave={(e) =>
                Object.assign(e.currentTarget.style, {
                  transform: "scale(1)",
                  boxShadow:
                    "0 4px 15px rgba(24, 144, 255, 0.6)",
                })
              }
            >
              {profile ? "تعديل" : "إنشاء"}
            </Button>
          )
        }
        bordered={false}
        style={{
          borderRadius: 20,
          boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
          backgroundColor: "#ffffff",
          padding: "30px 40px",
          minHeight: 480,
        }}
      >
        {isEditing ? (
          <ProfileForm
            initialValues={profile || undefined}
            onSuccess={handleSuccess}
            onCancel={() => setIsEditing(false)}
          />
        ) : profile ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 32,
                userSelect: "none",
              }}
            >
              <Avatar
                src={imageUrl}
                size={110}
                style={{
                  marginBottom: 16,
                  boxShadow: "0 6px 20px rgba(24, 144, 255, 0.4)",
                  backgroundColor: "#bae7ff",
                  fontSize: 44,
                  fontWeight: "bold",
                  color: "#096dd9",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {!imageUrl && profile.userName?.charAt(0)}
              </Avatar>
              <Title level={4} style={{ marginBottom: 6 }}>
                {profile.userName}
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                {profile.email}
              </Text>
            </div>

            <Divider style={{ marginBottom: 30 }} />

            <Descriptions
              bordered
              column={1}
              size="middle"
              labelStyle={{ fontWeight: "600", fontSize: 16, color: "#096dd9" }}
              contentStyle={{ fontSize: 15 }}
            >
              <Descriptions.Item label="رقم الهاتف">
                {profile.phone || <Text type="secondary">غير محدد</Text>}
              </Descriptions.Item>
              <Descriptions.Item label="العنوان">
                {profile.address || <Text type="secondary">غير محدد</Text>}
              </Descriptions.Item>
              <Descriptions.Item label="نبذة">
                {profile.bio || <Text type="secondary">لا توجد نبذة</Text>}
              </Descriptions.Item>
              <Descriptions.Item label="آخر تحديث">
                {new Date(profile.updatedAt).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Descriptions.Item>
            </Descriptions>
          </>
        ) : (
          <Text type="warning" style={{ fontSize: 16 }}>
            لا يوجد بروفايل حتى الآن.
          </Text>
        )}
      </Card>
    </div>
  );
};

export default MyProfilePage;
