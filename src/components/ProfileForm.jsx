import { useState, useEffect } from "react";
import { Button, Input, Form, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ProfileService from "../services/profile";

const ProfileForm = ({ initialValues = {}, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const isEdit = !!initialValues?.id;

  useEffect(() => {
    if (initialValues.profilePicture) {
      setFileList([
        {
          uid: "-1",
          name: "current-image.jpg",
          status: "done",
          url: `https://localhost:7056${initialValues.profilePicture}`,
        },
      ]);
    }
  }, [initialValues.profilePicture]);

  const uploadPicture = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    await ProfileService.uploadPicture(formData);
  };

  const handleRemovePicture = () => {
    setFileList([]);
    message.info("تم حذف الصورة مؤقتًا. لن تُرفع عند الحفظ.");
    // في حال أردت حذفها من السيرفر فعلًا:
    // await ProfileService.deletePicture();
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (isEdit) {
        await ProfileService.update({
          bio: values.bio,
          address: values.address,
          phone: values.phone,
          fullName: values.fullName,
          email: values.email,
        });
        message.success("تم تحديث البروفايل");
      } else {
        await ProfileService.create({
          bio: values.bio,
          address: values.address,
          phone: values.phone,
        });
        message.success("تم إنشاء البروفايل");
      }

      const file = fileList[0]?.originFileObj;
      if (file) {
        await uploadPicture(file);
        message.success("تم رفع الصورة الشخصية");
      }

      onSuccess();
    } catch (err) {
      console.error(err);
      message.error(err?.response?.data || "فشل في العملية");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        bio: initialValues.bio,
        address: initialValues.address,
        phone: initialValues.phone,
        fullName: initialValues.fullName,
        email: initialValues.email,
      }}
      onFinish={onFinish}
      style={{
        backgroundColor: "#f9fbfd",
        padding: 24,
        borderRadius: 16,
        boxShadow: "0 10px 25px rgba(0,0,0,0.07)",
      }}
    >
      <Form.Item
        name="fullName"
        label={<span style={{ fontWeight: 600, fontSize: 16 }}>الاسم الكامل</span>}
        rules={[{ required: true, message: "الرجاء إدخال الاسم الكامل" }]}
      >
        <Input
          placeholder="أدخل الاسم الكامل"
          style={{
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 15,
            boxShadow: "inset 0 1px 4px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 8px #40a9ff")}
          onBlur={(e) =>
            (e.currentTarget.style.boxShadow = "inset 0 1px 4px rgba(0,0,0,0.1)")
          }
        />
      </Form.Item>

      <Form.Item
        name="email"
        label={<span style={{ fontWeight: 600, fontSize: 16 }}>البريد الإلكتروني</span>}
        rules={[
          { required: true, message: "الرجاء إدخال البريد الإلكتروني" },
          { type: "email", message: "يرجى إدخال بريد إلكتروني صحيح" },
        ]}
      >
        <Input
          placeholder="example@mail.com"
          style={{
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 15,
            boxShadow: "inset 0 1px 4px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 8px #40a9ff")}
          onBlur={(e) =>
            (e.currentTarget.style.boxShadow = "inset 0 1px 4px rgba(0,0,0,0.1)")
          }
        />
      </Form.Item>

      <Form.Item
        name="bio"
        label={<span style={{ fontWeight: 600, fontSize: 16 }}>نبذة</span>}
      >
        <Input.TextArea
          rows={4}
          placeholder="شارك نبذة قصيرة عنك"
          style={{
            borderRadius: 14,
            padding: 12,
            fontSize: 15,
            boxShadow: "inset 0 1px 6px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
            resize: "vertical",
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 10px #40a9ff")}
          onBlur={(e) =>
            (e.currentTarget.style.boxShadow = "inset 0 1px 6px rgba(0,0,0,0.1)")
          }
        />
      </Form.Item>

      <Form.Item
        name="address"
        label={<span style={{ fontWeight: 600, fontSize: 16 }}>العنوان</span>}
      >
        <Input
          placeholder="أدخل عنوانك"
          style={{
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 15,
            boxShadow: "inset 0 1px 4px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 8px #40a9ff")}
          onBlur={(e) =>
            (e.currentTarget.style.boxShadow = "inset 0 1px 4px rgba(0,0,0,0.1)")
          }
        />
      </Form.Item>

      <Form.Item
        name="phone"
        label={<span style={{ fontWeight: 600, fontSize: 16 }}>رقم الهاتف</span>}
      >
        <Input
          placeholder="أدخل رقم الهاتف"
          style={{
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 15,
            boxShadow: "inset 0 1px 4px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 8px #40a9ff")}
          onBlur={(e) =>
            (e.currentTarget.style.boxShadow = "inset 0 1px 4px rgba(0,0,0,0.1)")
          }
        />
      </Form.Item>

      <Form.Item label={<span style={{ fontWeight: 600, fontSize: 16 }}>الصورة الشخصية</span>}>
        <Upload
          beforeUpload={() => false}
          onChange={({ fileList }) => setFileList(fileList)}
          fileList={fileList}
          maxCount={1}
          listType="picture"
          showUploadList={{
            showRemoveIcon: false,
          }}
          style={{ marginBottom: 8 }}
        >
          <Button
            icon={<UploadOutlined />}
            style={{
              borderRadius: 12,
              background:
                "linear-gradient(90deg, #40a9ff 0%, #1890ff 100%)",
              border: "none",
              color: "#fff",
              fontWeight: "600",
              padding: "8px 20px",
              boxShadow: "0 5px 15px rgba(24, 144, 255, 0.4)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, {
                filter: "brightness(110%)",
                boxShadow: "0 7px 20px rgba(24, 144, 255, 0.7)",
              })
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, {
                filter: "brightness(100%)",
                boxShadow: "0 5px 15px rgba(24, 144, 255, 0.4)",
              })
            }
          >
            اختر صورة
          </Button>
        </Upload>

        {fileList.length > 0 && (
          <Button
            danger
            style={{
              marginTop: 10,
              borderRadius: 12,
              fontWeight: "600",
              boxShadow: "0 3px 10px rgba(255, 77, 79, 0.5)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 5px 20px rgba(255, 77, 79, 0.8)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 3px 10px rgba(255, 77, 79, 0.5)")
            }
            onClick={handleRemovePicture}
          >
            حذف الصورة الحالية
          </Button>
        )}
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          style={{
            width: "100%",
            padding: "12px 0",
            borderRadius: 14,
            fontWeight: "700",
            fontSize: 18,
            boxShadow: "0 6px 18px rgba(24, 144, 255, 0.5)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) =>
            Object.assign(e.currentTarget.style, {
              filter: "brightness(110%)",
              boxShadow: "0 8px 25px rgba(24, 144, 255, 0.8)",
            })
          }
          onMouseLeave={(e) =>
            Object.assign(e.currentTarget.style, {
              filter: "brightness(100%)",
              boxShadow: "0 6px 18px rgba(24, 144, 255, 0.5)",
            })
          }
        >
          {isEdit ? "تحديث" : "إنشاء"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProfileForm;
