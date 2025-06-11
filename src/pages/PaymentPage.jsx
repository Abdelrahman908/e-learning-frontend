import {
  Alert,
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Spin,
  Table,
  Typography
} from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import PaymentService from '../services/payments';
import CourseService from '../services/courses';
import useAuth from '../hooks/useAuth';

const { Title, Text } = Typography;

const PaymentPage = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [course, setCourse] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [paymentDetails, setPaymentDetails] = useState({});
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [error, setError] = useState(null);

  const fetchPaymentData = useCallback(async () => {
    try {
      setLoading(true);
      const [courseData, payments] = await Promise.all([
        CourseService.getCourseById(courseId),
        PaymentService.getUserPayments(user.id, courseId)
      ]);
      setCourse(courseData);
      setPaymentHistory(payments || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, [courseId, user.id]);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      localStorage.setItem('redirectPath', location.pathname);
      navigate('/login');
      return;
    }

    fetchPaymentData();
  }, [authLoading, isAuthenticated, fetchPaymentData]);

  const hasCompletedPayment = paymentHistory.some(p => p.status === 'completed');

  const handlePayment = async () => {
    setProcessingPayment(true);
    try {
      const result = await PaymentService.pay({
        courseId: Number(courseId),
        paymentMethod,
        amount: course?.price || 0
      });

      if (!result.success) {
        throw new Error(result.message || 'فشل في عملية الدفع');
      }

      message.success(result.message || 'تم الدفع بنجاح');
      await fetchPaymentData();
      navigate(`/courses/${courseId}`, { state: { paymentSuccess: true } });
    } catch (err) {
      message.error(err.message || 'فشل الدفع');
    } finally {
      setProcessingPayment(false);
      setConfirmModalVisible(false);
    }
  };

  const handleCancelPayment = async (paymentId) => {
    try {
      const result = await PaymentService.cancelPayment(paymentId);
      if (result.success) {
        message.success(result.message || 'تم إلغاء الدفع بنجاح');
        await fetchPaymentData();
      } else {
        message.error(result.message || 'فشل إلغاء الدفع');
      }
    } catch (err) {
      message.error(err.message || 'فشل إلغاء الدفع');
    }
  };

  const renderStatus = (status) => {
    const colorMap = {
      completed: 'green',
      pending: 'orange',
      cancelled: 'red'
    };
    const color = colorMap[status] || 'blue';
    return <Text type={color === 'green' ? 'success' : color === 'red' ? 'danger' : undefined}>{status}</Text>;
  };

  const paymentColumns = [
    { title: 'الطريقة', dataIndex: 'paymentMethod', key: 'method', render: val => {
      const labels = {
        credit_card: 'بطاقة ائتمان',
        paypal: 'باي بال',
        bank_transfer: 'تحويل بنكي'
      };
      return labels[val] || val;
    }},
    { title: 'المبلغ', dataIndex: 'amount', key: 'amount', render: (val) => `$${val.toFixed(2)}` },
    { title: 'الحالة', dataIndex: 'status', key: 'status', render: renderStatus },
    { title: 'التاريخ', dataIndex: 'date', key: 'date' },
    {
      title: 'إجراء',
      key: 'action',
      render: (_, record) =>
        record.status === 'pending' ? (
          <Button danger size="small" onClick={() => handleCancelPayment(record.id)}>
            إلغاء
          </Button>
        ) : null
    }
  ];

  const renderPaymentInputs = () => {
    switch (paymentMethod) {
      case 'credit_card':
        return (
          <>
            <Form.Item
              label="رقم البطاقة"
              required
              rules={[{ required: true, message: 'يرجى إدخال رقم البطاقة' }]}
            >
              <Input
                placeholder="1234 5678 9012 3456"
                onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
              />
            </Form.Item>
            <Form.Item
              label="تاريخ الانتهاء"
              required
              rules={[{ required: true, message: 'يرجى إدخال تاريخ الانتهاء' }]}
            >
              <Input
                placeholder="MM/YY"
                onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiry: e.target.value }))}
              />
            </Form.Item>
          </>
        );
      case 'paypal':
        return (
          <Form.Item
            label="بريد PayPal"
            required
            rules={[{ required: true, message: 'يرجى إدخال بريد PayPal' }]}
          >
            <Input
              type="email"
              placeholder="example@paypal.com"
              onChange={(e) => setPaymentDetails(prev => ({ ...prev, paypalEmail: e.target.value }))}
            />
          </Form.Item>
        );
      case 'bank_transfer':
        return (
          <Form.Item
            label="رقم التحويل البنكي"
            required
            rules={[{ required: true, message: 'يرجى إدخال رقم التحويل' }]}
          >
            <Input
              placeholder="123456789"
              onChange={(e) => setPaymentDetails(prev => ({ ...prev, transferNumber: e.target.value }))}
            />
          </Form.Item>
        );
      default:
        return null;
    }
  };

  if (loading || authLoading || !course) {
    return <Spin size="large" className="flex justify-center mt-8" />;
  }

  if (error) {
    return <Alert message={error} type="error" showIcon className="m-4" />;
  }

  return (
    <div className="payment-page p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
      <Card
        bordered={false}
        style={{ borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
        bodyStyle={{ padding: '2rem' }}
        title={<Title level={3} className="text-center text-indigo-700">إتمام عملية الدفع</Title>}
      >
        <div className="mb-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200 shadow-inner">
          <Title level={4} className="mb-3 text-indigo-900">تفاصيل الدورة:</Title>
          <div className="flex justify-between items-center">
            <Text strong className="text-lg">{course.name}</Text>
            <Text strong className="text-2xl text-indigo-700">${course.price.toFixed(2)}</Text>
          </div>
        </div>

        <Divider orientation="left" style={{ fontWeight: 'bold', color: '#5c6ac4' }}>
          طريقة الدفع
        </Divider>

        {hasCompletedPayment ? (
          <Alert
            message="تم دفع هذه الدورة مسبقًا"
            type="success"
            showIcon
            className="mb-6"
            style={{ fontWeight: 'bold' }}
          />
        ) : (
          <Form layout="vertical" className="mt-4">
            <Form.Item label="اختر طريقة الدفع">
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setPaymentDetails({});
                }}
                optionType="button"
                buttonStyle="solid"
                size="large"
              >
                <Radio.Button value="credit_card">💳 بطاقة ائتمان</Radio.Button>
                <Radio.Button value="paypal">📱 باي بال</Radio.Button>
                <Radio.Button value="bank_transfer">🏦 تحويل بنكي</Radio.Button>
              </Radio.Group>
            </Form.Item>

            {renderPaymentInputs()}

            <Divider />

            <div className="flex justify-between items-center mt-8">
              <Link to={`/courses/${courseId}`}>
               <Button
                size="large"
                style={{
                  fontWeight: 'bold',
                  borderRadius: 8,
                  padding: '0 24px',
                  boxShadow: '0 4px 15px rgba(92,106,196,0.25)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(92,106,196,0.4)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 15px rgba(92,106,196,0.25)'}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                إلغاء والعودة
              </Button>
              </Link>
              <Button
              type="primary"
              size="large"
              loading={processingPayment}
              onClick={() => setConfirmModalVisible(true)}
              style={{
                fontWeight: 'bold',
                borderRadius: 8,
                padding: '0 28px',
                boxShadow: '0 4px 15px rgba(92,106,196,0.5)',
                transition: 'all 0.3s ease',
                backgroundColor: '#5c6ac4',
                borderColor: '#5c6ac4',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#4855a9';
                e.currentTarget.style.borderColor = '#4855a9';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(72,85,169,0.7)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#5c6ac4';
                e.currentTarget.style.borderColor = '#5c6ac4';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(92,106,196,0.5)';
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              تأكيد الدفع
            </Button>
            </div>
          </Form>
        )}
      </Card>

      <Divider orientation="left" className="mt-12 mb-6" style={{ fontWeight: 'bold', color: '#5c6ac4' }}>
        سجل المدفوعات
      </Divider>

      <Card
        bordered={false}
        style={{ borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
      >
        <Table
          dataSource={paymentHistory}
          columns={paymentColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          locale={{
            emptyText: (
              <div className="text-center py-8">
                <Text type="secondary">لا يوجد سجل مدفوعات حتى الآن</Text>
              </div>
            )
          }}
          scroll={{ x: '100%' }}
          style={{ fontSize: '14px' }}
          rowClassName={(record) =>
            record.status === 'completed' ? 'bg-green-50' :
            record.status === 'cancelled' ? 'bg-red-50' : ''
          }
        />
      </Card>

      <Modal
        title="تأكيد العملية"
        open={confirmModalVisible}
        onOk={handlePayment}
        onCancel={() => setConfirmModalVisible(false)}
        okText="نعم، قم بالدفع"
        cancelText="إلغاء"
        confirmLoading={processingPayment}
        centered
        bodyStyle={{ fontSize: '16px', fontWeight: '600' }}
        okButtonProps={{ style: { backgroundColor: '#5c6ac4', borderColor: '#5c6ac4' } }}
      >
        <Text>هل أنت متأكد أنك تريد إتمام عملية الدفع بمبلغ <span style={{ fontWeight: 'bold' }}>${course.price.toFixed(2)}</span>؟</Text>
      </Modal>
    </div>
  );
};

export default PaymentPage;
