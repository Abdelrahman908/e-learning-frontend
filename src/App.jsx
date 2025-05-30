import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import Layout from "./components/layout/Layout";
import ErrorBoundary from './utils/ErrorBoundary';

// Lazy loading for better performance
const Navbar = React.lazy(() => import("./components/layout/Navbar"));
const Footer = React.lazy(() => import("./components/layout/Footer"));
const Hero = React.lazy(() => import("./components/layout/Hero"));
const Sidebar = React.lazy(() => import("./components/layout/Sidebar"));
const ToastContainer = React.lazy(() => import("./components/ui/ToastContainer"));
const NotAuthorized = React.lazy(() => import("./pages/NotAuthorized"));

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
const AdminCourses = React.lazy(() => import("./pages/admin/AdminCourses"));

const DashboardRouter = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/login" replace />;

  const userRole = user.role?.toLowerCase();
  
  switch (userRole) {
    case "admin":
      return <AdminDashboard />;
    case "instructor":
      return <InstructorDashboard />;
    case "student":
      return <StudentDashboard />;
    default:
      return <Navigate to="/not-authorized" replace />;
  }
};

const App = () => {
  const { isAuthenticated } = useAuth();

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
                  element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
                />
                <Route 
                  path="/register" 
                  element={isAuthenticated ? <Navigate to="/confirm-email" replace /> : <Register />} 
                />
                <Route path="/confirm-email" element={<ConfirmEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route 
                  path="/reset-password" 
                  element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ResetPassword />} 
                />
                <Route path="/courses/:id" element={<CourseDetails />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route 
                    path="/dashboard" 
                    element={
                      <Layout>
                        <DashboardRouter />
                      </Layout>
                    } 
                  />
                </Route>

                <Route element={<ProtectedRoute roles={['instructor', 'admin']} />}>
                  <Route 
                    path="/courses/edit/:id" 
                    element={
                      <Layout>
                        <UpdateCourseWithImage />
                      </Layout>
                    } 
                  />
                </Route>

                <Route element={<ProtectedRoute roles={['admin']} />}>
                  <Route 
                    path="/admin/courses" 
                    element={
                      <Layout>
                        <AdminCourses />
                      </Layout>
                    } 
                  />
                </Route>

                {/* Error routes */}
                <Route path="/not-authorized" element={<NotAuthorized />} />
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