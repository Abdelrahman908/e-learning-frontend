import { useState, useEffect } from 'react';
import {
  useParams,
  useNavigate,
  Link,
  useLocation
} from 'react-router-dom';
import {
  Card,
  Form,
  Radio,
  Button,
  Spin,
  Alert,
  message,
  Divider,
  Typography,
  Modal,
  Table,
  Input
} from 'antd';
import CourseService from "../services/courses.js";
import PaymentService from '../services/payments';

import useAuth from '../hooks/useAuth'; // 👈 أضف هذا

const { Title, Text } = Typography;

const PaymentPage = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [paymentDetails, setPaymentDetails] = useState({});
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      localStorage.setItem('redirectPath', location.pathname);
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [courseData, payments] = await Promise.all([
          CourseService.getCourseById(courseId),
          PaymentService.getUserPayments(user.id, courseId)
        ]);
        setCourse(courseData);
        setPaymentHistory(payments || []);
      } catch (err) {
        setError(err.message || 'حدث خطأ أثناء تحميل بيانات الصفحة');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, isAuthenticated, authLoading]);

  const handlePayment = async () => {
    setProcessingPayment(true);
    try {
      const paymentResult = await CourseService.pay({
        courseId: Number(courseId),
        paymentMethod,
        amount: course?.price || 0,
        details: paymentDetails
      });

      if (!paymentResult.success) {
        throw new Error(paymentResult.message || 'فشل في عملية الدفع');
      }

      await CourseService.enroll(courseId, user.id);
      message.success(paymentResult.message || 'تم الدفع والتسجيل بنجاح');
      navigate(`/courses/${courseId}`, { state: { paymentSuccess: true } });

    } catch (err) {
      message.error(err.message || 'فشل الدفع');
    } finally {
      setProcessingPayment(false);
      setConfirmModalVisible(false);
    }
  };

  const paymentColumns = [
    { title: 'الطريقة', dataIndex: 'paymentMethod', key: 'method' },
    { title: 'المبلغ', dataIndex: 'amount', key: 'amount', render: (val) => `$${val}` },
    { title: 'الحالة', dataIndex: 'status', key: 'status' },
    { title: 'التاريخ', dataIndex: 'date', key: 'date' }
  ];

  const renderPaymentInputs = () => {
    switch (paymentMethod) {
      case 'credit_card':
        return (
          <>
            <Form.Item label="رقم البطاقة">
              <Input
                placeholder="1234 5678 9012 3456"
                onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
              />
            </Form.Item>
            <Form.Item label="تاريخ الانتهاء">
              <Input
                placeholder="MM/YY"
                onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiry: e.target.value }))}
              />
            </Form.Item>
          </>
        );
      case 'paypal':
        return (
          <Form.Item label="بريد PayPal">
            <Input
              type="email"
              placeholder="example@paypal.com"
              onChange={(e) => setPaymentDetails(prev => ({ ...prev, paypalEmail: e.target.value }))}
            />
          </Form.Item>
        );
      case 'bank_transfer':
        return (
          <Form.Item label="رقم التحويل البنكي">
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
    <div className="payment-page p-4 max-w-4xl mx-auto">
      <Card title={<Title level={3} className="text-center">إتمام عملية الدفع</Title>} className="shadow-lg">

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <Title level={4} className="mb-2">تفاصيل الدورة:</Title>
          <div className="flex justify-between items-center">
            <Text strong className="text-lg">{course.name}</Text>
            <Text strong className="text-xl text-blue-600">${course.price}</Text>
          </div>
        </div>

        <Divider orientation="left">طريقة الدفع</Divider>

        <Form layout="vertical" className="mt-4">
          <Form.Item label="اختر طريقة الدفع">
            <Radio.Group
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setPaymentDetails({});
              }}
            >
              <Radio.Button value="credit_card">💳 بطاقة ائتمان</Radio.Button>
              <Radio.Button value="paypal">📱 باي بال</Radio.Button>
              <Radio.Button value="bank_transfer">🏦 تحويل بنكي</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {renderPaymentInputs()}

          <Divider />

          <div className="flex justify-between items-center mt-6">
            <Link to={`/courses/${courseId}`}>
              <Button size="large">إلغاء والعودة</Button>
            </Link>
            <Button
              type="primary"
              size="large"
              loading={processingPayment}
              onClick={() => setConfirmModalVisible(true)}
            >
              تأكيد الدفع
            </Button>
          </div>
        </Form>
      </Card>

      <Divider orientation="left" className="mt-10">سجل المدفوعات</Divider>
      <Card>
        <Table
          dataSource={paymentHistory}
          columns={paymentColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Modal
        title="تأكيد العملية"
        visible={confirmModalVisible}
        onOk={handlePayment}
        onCancel={() => setConfirmModalVisible(false)}
        okText="نعم، قم بالدفع"
        cancelText="إلغاء"
        confirmLoading={processingPayment}
      >
        <Text>هل أنت متأكد أنك تريد إتمام عملية الدفع بمبلغ ${course.price}؟</Text>
      </Modal>
    </div>
  );
};

export default PaymentPage;
