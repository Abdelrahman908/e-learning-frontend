import React, { useContext, Suspense } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext"; 
import ProtectedRoute from "./components/common/ProtectedRoute";
import ToastContainer from "./components/ui/ToastContainer";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import Layout from "./components/layout/Layout";
import ErrorBoundary from './utils/ErrorBoundary';
// App.jsx
// Lazy loading
const Navbar = React.lazy(() => import("./components/layout/Navbar"));
const Footer = React.lazy(() => import("./components/layout/Footer"));
const Hero = React.lazy(() => import("./components/layout/Hero"));
const Sidebar = React.lazy(() => import("./components/layout/Sidebar"));


// Public pages
const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const ConfirmEmail = React.lazy(() => import("./pages/auth/ConfirmEmail"));
const ForgotPassword = React.lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/auth/ResetPassword"));
const CourseDetails = React.lazy(() => import("./pages/student/CourseDetails"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Protected pages
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const StudentDashboard = React.lazy(() => import("./pages/student/StudentDashboard"));
const InstructorDashboard = React.lazy(() => import("./pages/instructor/InstructorDashboard"));
const UpdateCourseWithImage = React.lazy(() => import("./pages/instructor/UpdateCourseWithImage"));

const DashboardRouter = () => {
  const { user } = useAuth(); // استخدم useAuth هنا أيضاً

  if (!user) {
    return <LoadingSpinner fullScreen />;
  }

  // تحويل أدوار المستخدمين إلى سلسلة نصية لتجنب مشاكل المقارنة
  const userRole = String(user.role).toLowerCase();
  
  switch (userRole) {
    case "admin":
      return <AdminDashboard />;
    case "instructor":
      return <InstructorDashboard />;
    case "student":
      return <StudentDashboard />;
    default:
      return <Navigate to="/not-found" />;
  }
};

const App = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // تحقق من أن isAuthenticated قيمة boolean
  const authStatus = Boolean(isAuthenticated);

  // معالجة أخطاء التوجيه
  const safeNavigate = (path) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = path;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white text-gray-800 flex flex-col">
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Navbar />
          <Hero />

          <main className="flex-grow py-6">
            <div className="container mx-auto px-4">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route 
                  path="/login" 
                  element={authStatus ? <Navigate to="/courses" replace /> : <Login />} 
                />
                <Route 
                  path="/register" 
                  element={authStatus ? <Navigate to="/confirm-email" replace /> : <Register />} 
                />
                
                <Route path="/confirm-email" element={<ConfirmEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route 
                  path="/reset-password" 
                 element={authStatus ? <Navigate to="/dashboard" replace /> : <ResetPassword />} 
                />
                <Route path="/courses/:id" element={<CourseDetails />} />
                
                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <DashboardRouter />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/courses/edit/:id"
                  element={
                    <ProtectedRoute roles={['instructor', 'admin']}>
                      <Layout>
                        <UpdateCourseWithImage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* Fallback routes */}
                <Route path="/not-found" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/not-found" replace />} />
              </Routes>
            </div>
          </main>

          <Footer />
          <ToastContainer />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default App;