import React, { useEffect, useState, useMemo } from 'react';
import { Bell, Trash2, Mail, AlertTriangle, DollarSign } from 'lucide-react';
import { Table, Tag, Spin, Alert, Button, message, Input, Select, Popconfirm } from 'antd';
import NotificationService from '../services/notifications';
import useAuth from '../hooks/useAuth';

const { Search } = Input;
const { Option } = Select;

const NotificationPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await NotificationService.getMyNotifications();
        setNotifications(data.Notifications || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!user) return;

    NotificationService.startConnection((notification) => {
      setNotifications(prev => [notification, ...prev]);
      showNotificationToast(notification);
    });

    return () => {
      NotificationService.stopConnection();
    };
  }, [user]);

  const showNotificationToast = (notification) => {
    const { type, title } = notification;
    switch (type) {
      case 'message':
        message.success(title);
        break;
      case 'alert':
        message.warning(title);
        break;
      case 'payment':
        message.info(title);
        break;
      default:
        message.open({ type: 'info', content: title });
        break;
    }
  };

  const handleMarkAsRead = async (id, isRead) => {
    try {
      await NotificationService.updateReadStatus(id, isRead);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead } : n)
      );
    } catch (err) {
      message.error('فشل تحديث الحالة');
    }
  };

  const handleDelete = async (id) => {
    try {
      await NotificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      message.error('فشل حذف الإشعار');
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
      await Promise.all(unreadIds.map(id => NotificationService.updateReadStatus(id, true)));
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      message.success('تم تمييز جميع الإشعارات كمقروءة');
    } catch {
      message.error('فشل تنفيذ العملية');
    }
  };

  const deleteAll = async () => {
    try {
      const ids = notifications.map(n => n.id);
      await Promise.all(ids.map(id => NotificationService.deleteNotification(id)));
      setNotifications([]);
      message.success('تم حذف جميع الإشعارات');
    } catch {
      message.error('فشل حذف الإشعارات');
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications
      .filter(n => {
        if (filterStatus === "read") return n.isRead;
        if (filterStatus === "unread") return !n.isRead;
        return true;
      })
      .filter(n =>
        n.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        n.message?.toLowerCase().includes(searchText.toLowerCase())
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [notifications, filterStatus, searchText]);

  const getIcon = (type) => {
    switch (type) {
      case 'message':
        return <Mail className="text-blue-500" />;
      case 'alert':
        return <AlertTriangle className="text-yellow-500" />;
      case 'payment':
        return <DollarSign className="text-green-500" />;
      default:
        return <Bell className="text-gray-500" />;
    }
  };

  const columns = [
    {
      title: 'نوع',
      dataIndex: 'type',
      render: (val) => getIcon(val)
    },
    {
      title: 'العنوان',
      dataIndex: 'title',
    },
    {
      title: 'الرسالة',
      dataIndex: 'message',
    },
    {
      title: 'الحالة',
      dataIndex: 'isRead',
      render: (val) => val ? <Tag color="green">مقروء</Tag> : <Tag color="orange">غير مقروء</Tag>
    },
    {
      title: 'التاريخ',
      dataIndex: 'createdAt',
      render: val => new Date(val).toLocaleString()
    },
    {
      title: 'الخيارات',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => handleMarkAsRead(record.id, !record.isRead)}>
            {record.isRead ? 'كغير مقروء' : 'كمقروء'}
          </Button>
          <Button size="small" danger icon={<Trash2 />} onClick={() => handleDelete(record.id)} />
        </div>
      )
    }
  ];

  if (loading) return <Spin className="mt-10 block mx-auto" />;
  if (error) return <Alert message={error} type="error" className="m-4" />;

  return (
    <div className="max-w-6xl mx-auto mt-6 p-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Bell /> الإشعارات
      </h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <Search
          placeholder="بحث في العنوان أو الرسالة"
          onChange={e => setSearchText(e.target.value)}
          allowClear
          className="w-64"
        />
        <Select
          value={filterStatus}
          onChange={val => setFilterStatus(val)}
          className="w-40"
        >
          <Option value="all">الكل</Option>
          <Option value="read">المقروءة فقط</Option>
          <Option value="unread">الغير مقروءة</Option>
        </Select>
        <Button onClick={markAllAsRead} disabled={!notifications.some(n => !n.isRead)}>
          تمييز الكل كمقروء
        </Button>
        <Popconfirm
          title="هل أنت متأكد من حذف جميع الإشعارات؟"
          onConfirm={deleteAll}
          okText="نعم"
          cancelText="لا"
        >
          <Button danger>حذف الكل</Button>
        </Popconfirm>
      </div>

      <Table
        dataSource={filteredNotifications}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 6 }}
      />
    </div>
  );
};

export default NotificationPage;
