import React, { useEffect, useState } from "react";
import {
  Table,
  Typography,
  Spin,
  message,
  Button,
  Space,
  Popconfirm,
  Image,
} from "antd";
import CourseService from "../../services/courses";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  ReloadOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const MyCoursesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const result = await CourseService.getInstructorCourses(user?.id, {
        sortBy: "newest",
      });
      setCourses(
        result.map((c) => ({
          ...c,
          key: c.id,
          priceDisplay: c.isFree ? "مجانًا" : `${c.price} ج.م`,
        }))
      );
    } catch (error) {
      message.error(error.message || "فشل في تحميل الدورات");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await CourseService.deleteCourse(id);
      message.success("تم حذف الدورة بنجاح");
      fetchCourses();
    } catch (error) {
      message.error(error.message || "فشل في حذف الدورة");
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchCourses();
    }
  }, [user?.id]);

  const columns = [
    {
      title: "العنوان",
      dataIndex: "title",
      render: (_, record) => (
        <Space align="center">
          {record.image && (
            <Image
              src={record.image}
              alt="صورة الدورة"
              width={60}
              height={40}
              style={{
                objectFit: "cover",
                borderRadius: 8,
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
              preview={false}
            />
          )}
          <span style={{ fontWeight: "600", fontSize: 16 }}>{record.title}</span>
        </Space>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
      width: "25%",
    },
    {
      title: "الوصف",
      dataIndex: "description",
      ellipsis: true,
      width: "35%",
      render: (text) => <span style={{ color: "#555" }}>{text}</span>,
    },
    {
      title: "الحالة",
      dataIndex: "isActive",
      filters: [
        { text: "نشطة", value: true },
        { text: "غير نشطة", value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (val) => (
        <span
          style={{
            color: val ? "#52c41a" : "#ff4d4f",
            fontWeight: "700",
          }}
        >
          {val ? "نشطة" : "غير نشطة"}
        </span>
      ),
      width: "10%",
      align: "center",
    },
    {
      title: "السعر",
      dataIndex: "priceDisplay",
      align: "center",
      width: "10%",
      render: (text) => (
        <span style={{ fontWeight: "600", color: "#1d39c4" }}>{text}</span>
      ),
    },
    {
      title: "الخيارات",
      key: "actions",
      render: (_, record) => (
        <Space size="middle" style={{ justifyContent: "center" }}>
          <Link to={`/courses/${record.id}`}>
            <Button
              type="default"
              icon={<EyeOutlined />}
              size="small"
              className="custom-btn view"
            >
              عرض
            </Button>
          </Link>
          <Link to={`/courses/edit/${record.id}`}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              className="custom-btn edit"
            >
              تعديل
            </Button>
          </Link>
          <Popconfirm
            title="هل أنت متأكد من حذف هذه الدورة؟"
            onConfirm={() => handleDelete(record.id)}
            okText="نعم"
            cancelText="إلغاء"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              className="custom-btn delete"
            >
              حذف
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: "20%",
      align: "center",
    },
  ];

  return (
    <div
      className="p-8 max-w-6xl mx-auto"
      style={{ backgroundColor: "#f4f6fa", minHeight: "100vh" }}
    >
      <Title
        level={2}
        style={{
          textAlign: "center",
          marginBottom: 10,
          color: "#2f3640",
          fontWeight: "900",
          letterSpacing: "0.04em",
        }}
      >
        📚 دوراتي التعليمية
      </Title>

      <div
        style={{
          borderBottom: "3px solid #1976d2",
          width: "80px",
          margin: "0 auto 30px auto",
          borderRadius: 2,
        }}
      ></div>

      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <Link to="/courses/new">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            className="custom-btn create"
          >
            إنشاء دورة جديدة
          </Button>
        </Link>

        <Button
          type="default"
          icon={<ReloadOutlined />}
          size="large"
          className="custom-btn refresh"
          onClick={fetchCourses}
        >
          تحديث القائمة
        </Button>
      </div>

      {loading ? (
        <div className="text-center mt-16">
          <Spin size="large" tip="جارٍ التحميل..." />
        </div>
      ) : courses.length === 0 ? (
        <p
          className="text-center text-gray-600"
          style={{
            fontSize: 18,
            fontWeight: "600",
            marginTop: 40,
            color: "#7f8c8d",
          }}
        >
          لم تقم بإنشاء أي دورة بعد. ابدأ الآن!
        </p>
      ) : (
        <Table
          columns={columns}
          dataSource={courses}
          pagination={{ pageSize: 6 }}
          bordered
          rowClassName={() => "hover-row"}
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 2px 15px rgba(0, 0, 0, 0.05)",
          }}
        />
      )}

      <style>{`
        .hover-row:hover {
          background-color: #f0f5ff !important;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .custom-btn {
          font-weight: 600;
          transition: all 0.3s ease;
          border-radius: 6px;
        }

        .custom-btn.view:hover {
          background-color: #e6f7ff;
          color: #1890ff;
        }

        .custom-btn.edit {
          background-color: #3f51b5;
          border-color: #3f51b5;
        }

        .custom-btn.edit:hover {
          background-color: #2c3e9e;
          border-color: #2c3e9e;
        }

        .custom-btn.delete {
          min-width: 60px;
          padding: 0 10px;
        }

        .custom-btn.delete:hover {
          transform: scale(1.08);
        }

        .custom-btn.create {
          background-color: #1976d2;
          border-color: #1976d2;
        }

        .custom-btn.create:hover {
          background-color: #125ea9;
          border-color: #125ea9;
        }

        .custom-btn.refresh:hover {
          background-color: #d6ecff;
        }
      `}</style>
    </div>
  );
};

export default MyCoursesPage;
