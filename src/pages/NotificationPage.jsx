import React, { useEffect, useState, useMemo } from 'react';
import { Bell, Trash2, Mail, AlertTriangle, DollarSign, CheckCircle, XCircle, Filter } from 'lucide-react';
import { Table, Tag, Spin, Alert, Button, message, Input, Select, Popconfirm, Tooltip, Badge } from 'antd';
import NotificationService from '../services/notifications';
import useAuth from '../hooks/useAuth';

const { Search } = Input;
const { Option } = Select;

const sampleNotifications = [
  {
    id: 1,
    type: 'message',
    title: 'رسالة جديدة من الدعم',
    message: 'يرجى مراجعة استفسارك في قسم الدعم.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 2,
    type: 'alert',
    title: 'تنبيه أمني',
    message: 'تم تسجيل دخول من جهاز جديد.',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
];

const NotificationPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const fetchData = async () => {
      try {
        const data = await NotificationService.getMyNotifications();
        setNotifications(data.Notifications || sampleNotifications);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

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
      message.success(isRead ? 'تم تمييز الإشعار كمقروء' : 'تم تمييز الإشعار كغير مقروء');
    } catch (err) {
      message.error('فشل تحديث الحالة');
    }
  };

  const handleDelete = async (id) => {
    try {
      await NotificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      message.success('تم حذف الإشعار');
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
    const baseClass = "inline-block mr-1 align-middle";
    switch (type) {
      case 'message':
        return <Mail className={`${baseClass} text-blue-600`} size={20} />;
      case 'alert':
        return <AlertTriangle className={`${baseClass} text-yellow-600`} size={20} />;
      case 'payment':
        return <DollarSign className={`${baseClass} text-green-600`} size={20} />;
      default:
        return <Bell className={`${baseClass} text-gray-400`} size={20} />;
    }
  };

  const columns = [
    {
      title: 'نوع',
      dataIndex: 'type',
      width: 80,
      render: (val) => (
        <Tooltip title={`نوع الإشعار: ${val}`}>
          {getIcon(val)}
        </Tooltip>
      )
    },
    {
      title: 'العنوان',
      dataIndex: 'title',
      ellipsis: true,
      render: (text, record) => (
        <div style={{ fontWeight: record.isRead ? '400' : '700', color: record.isRead ? '#555' : '#222' }}>{text}</div>
      )
    },
    {
      title: 'الرسالة',
      dataIndex: 'message',
      ellipsis: true,
      render: (text, record) => (
        <div style={{ fontWeight: record.isRead ? '400' : '700', color: record.isRead ? '#555' : '#222' }}>{text}</div>
      )
    },
    {
      title: 'الحالة',
      dataIndex: 'isRead',
      width: 100,
      filters: [
        { text: 'مقروء', value: true },
        { text: 'غير مقروء', value: false }
      ],
      onFilter: (value, record) => record.isRead === value,
      render: (val) =>
        val
          ? <Tag color="green" icon={<CheckCircle />}>مقروء</Tag>
          : <Tag color="orange" icon={<XCircle />}>غير مقروء</Tag>
    },
    {
      title: 'التاريخ',
      dataIndex: 'createdAt',
      width: 180,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: val => new Date(val).toLocaleString()
    },
    {
      title: 'الخيارات',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title={record.isRead ? "اجعلها غير مقروءة" : "اجعلها مقروءة"}>
            <Button
              size="small"
              type={record.isRead ? "default" : "primary"}
              onClick={() => handleMarkAsRead(record.id, !record.isRead)}
              style={{ minWidth: 80, borderRadius: 8, boxShadow: '0 1px 3px rgb(0 0 0 / 0.1)' }}
            >
              {record.isRead ? 'غير مقروء' : 'مقروء'}
            </Button>
          </Tooltip>
          <Tooltip title="حذف الإشعار">
            <Button
              size="small"
              danger
              icon={<Trash2 size={16} />}
              onClick={() => handleDelete(record.id)}
              style={{ borderRadius: 8 }}
            />
          </Tooltip>
        </div>
      )
    }
  ];

  if (loading) return <Spin className="mt-10 block mx-auto" size="large" />;
  if (error) return <Alert message={error} type="error" className="m-4" />;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-6xl mx-auto mt-8 p-8 bg-white rounded-xl shadow-2xl">
      <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-black select-none">
        <Badge count={unreadCount} offset={[6, -10]} color="#000" size="default">
          <Button
            type="text"
            className="p-0"
            style={{
              color: '#000',
              fontWeight: '900',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'default',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              borderRadius: '50%',
              width: 48,
              height: 48,
              backgroundColor: '#fff',
              border: '2px solid #000',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#000'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
          >
            <Bell size={28} />
          </Button>
        </Badge>
        الإشعارات
      </h2>

      <div className="flex flex-wrap items-center gap-5 mb-6">
        <Search
          placeholder="بحث في العنوان أو الرسالة"
          onChange={e => setSearchText(e.target.value)}
          allowClear
          className="w-72"
          enterButton
          size="large"
          style={{ borderRadius: 10, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
        />
        <Select
          suffixIcon={<Filter size={16} />}
          value={filterStatus}
          onChange={val => setFilterStatus(val)}
          className="w-44"
          dropdownMatchSelectWidth={false}
          size="large"
          style={{ borderRadius: 10, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
        >
          <Option value="all">الكل</Option>
          <Option value="read">المقروءة فقط</Option>
          <Option value="unread">الغير مقروءة</Option>
        </Select>
        <Tooltip title="تمييز جميع الإشعارات كمقروءة">
          <Button
            onClick={markAllAsRead}
            disabled={!notifications.some(n => !n.isRead)}
            type="primary"
            ghost
            size="large"
            style={{ borderRadius: 10, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
          >
            تمييز الكل كمقروء
          </Button>
        </Tooltip>
        <Popconfirm
          title="هل أنت متأكد من حذف جميع الإشعارات؟"
          onConfirm={deleteAll}
          okText="نعم"
          cancelText="لا"
        >
          <Tooltip title="حذف جميع الإشعارات">
            <Button
              danger
              size="large"
              style={{ borderRadius: 10, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
            >
              حذف الكل
            </Button>
          </Tooltip>
        </Popconfirm>
      </div>

      <Table
        dataSource={filteredNotifications}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 6, showSizeChanger: true, pageSizeOptions: ['6', '12', '24'] }}
        scroll={{ x: 1000 }}
        rowClassName={(record) =>
          !record.isRead ? 'bg-blue-50 font-semibold' : ''
        }
        style={{ borderRadius: 14, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        onRow={(record) => ({
          onMouseEnter: e => e.currentTarget.style.backgroundColor = '#d0eaff',
          onMouseLeave: e => e.currentTarget.style.backgroundColor = record.isRead ? '' : '#e6f7ff'
        })}
      />
    </div>
  );
};

export default NotificationPage;
