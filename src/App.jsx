import React, { Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ProtectedLoginRoute from "./components/common/ProtectedLoginRoute";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import Layout from "./components/layout/Layout";
import ErrorBoundary from "./utils/ErrorBoundary";
import DashboardRouter from "./components/DashboardRouter";
import { ChatProvider } from "./contexts/ChatContext";
import ChatBotPage from "./pages/ChatBotPage";

// Lazy loaded layout components
const Navbar = React.lazy(() => import("./components/layout/Navbar"));
const Footer = React.lazy(() => import("./components/layout/Footer"));
const Hero = React.lazy(() => import("./components/layout/Hero"));
const ToastContainer = React.lazy(() => import("./components/ui/ToastContainer"));

// Lazy loaded public pages
const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const ConfirmEmail = React.lazy(() => import("./pages/auth/ConfirmEmail"));
const ForgotPassword = React.lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/auth/ResetPassword"));
const ViewCoursePage = React.lazy(() => import("./pages/ViewCoursePage"));
const CoursesPage = React.lazy(() => import("./pages/CoursesPage"));
const NotAuthorized = React.lazy(() => import("./pages/NotAuthorized"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));


// Dashboards
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const InstructorDashboard = React.lazy(() => import("./pages/instructor/InstructorDashboard"));
const StudentDashboard = React.lazy(() => import("./pages/student/StudentDashboard"));

// Course management pages
const AddCoursePage = React.lazy(() => import("./pages/AddCoursePage"));
const EditCoursePage = React.lazy(() => import("./pages/EditCoursePage"));
const PaymentPage = React.lazy(() => import("./pages/PaymentPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const MyProfilePage = React.lazy(() => import("./pages/MyProfilePage"));
const MyCoursesPage = React.lazy(() => import("./pages/instructor/MyCoursesPage"));
const CourseChatPage = React.lazy(() => import("./pages/CourseChatPage"));

// Notifications
const NotificationPage = React.lazy(() => import("./pages/NotificationPage"));

// User management pages
const UsersPage = React.lazy(() => import("./pages/admin/UsersPage"));
const CreateUserPage = React.lazy(() => import("./pages/admin/users/CreateUserPage"));
const EditUserPage = React.lazy(() => import("./pages/admin/users/EditUserPage"));
const UserDetailsPage = React.lazy(() => import("./pages/admin/UserDetailsPage"));

// Category management
const CategoriesPage = React.lazy(() => import("./pages/CategoriesPage"));
const CreateCategoryPage = React.lazy(() => import("./pages/CreateCategoryPage"));

// ** صفحات الدروس **
const LessonsListPage = React.lazy(() => import("./pages/lessons/LessonsListPage"));
const LessonDetailsPage = React.lazy(() => import("./pages/lessons/LessonDetailsPage"));
const CreateLessonPage = React.lazy(() => import("./pages/lessons/CreateLessonPage"));
const EditLessonPage = React.lazy(() => import("./pages/lessons/EditLessonPage"));

const App = () => {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-white text-gray-800">
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Navbar />

          {location.pathname === "/" && <Hero />}

          <main className="flex-grow py-6">
            <div className="container mx-auto px-4">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<ContactPage />} />
               <Route path="/about" element={<AboutPage />} />
                <Route path="/chatbot" element={<ChatBotPage />} />
                <Route
                  path="/login"
                  element={
                    <ProtectedLoginRoute>
                      <Login />
                    </ProtectedLoginRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <ProtectedLoginRoute>
                      <Register />
                    </ProtectedLoginRoute>
                  }
                />
                <Route path="/confirm-email" element={<ConfirmEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/reset-password"
                  element={
                    <ProtectedLoginRoute>
                      <ResetPassword />
                    </ProtectedLoginRoute>
                  }
                />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/courses/:id" element={<ViewCoursePage />} />

                {/* Protected Profile Routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <MyProfilePage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
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
                  path="/courses/new"
                  element={
                    <ProtectedRoute roles={["instructor", "admin"]}>
                      <Layout>
                        <AddCoursePage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/edit/:id"
                  element={
                    <ProtectedRoute roles={["instructor", "admin"]} requireCourseOwnership>
                      <Layout>
                        <EditCoursePage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/my-courses"
                  element={
                     <ProtectedRoute roles={["instructor"]}>
                      <Layout>
                        <MyCoursesPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:id/payment"
                  element={
                    <ProtectedRoute roles={["student"]}>
                      <Layout>
                        <PaymentPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
  path="/courses/:courseId/chat"
  element={
    <ProtectedRoute roles={["student", "instructor", "admin"]}>
      <ChatProvider>
        <Layout>
          <CourseChatPage />
        </Layout>
      </ChatProvider>
    </ProtectedRoute>
  }
/>


                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <NotificationPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* ===== صفحات الدروس ===== */}
               {/* ===== صفحات الدروس ===== */}
                  <Route
                    path="/courses/:courseId/lessons"
                    element={
                      <ProtectedRoute roles={["student", "instructor", "admin"]}>
                        <Layout>
                          <LessonsListPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/courses/:courseId/lessons/new"
                    element={
                      <ProtectedRoute roles={["instructor", "admin"]}>
                        <Layout>
                          <CreateLessonPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/courses/:courseId/lessons/:id/edit"
                    element={
                      <ProtectedRoute roles={["instructor", "admin"]} requireLessonOwnership>
                        <Layout>
                          <EditLessonPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/courses/:courseId/lessons/:id"
                    element={
                      <ProtectedRoute roles={["student", "instructor", "admin"]}>
                        <Layout>
                          <LessonDetailsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                

                {/* Admin Routes */}
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <Layout>
                        <UsersPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users/create"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <Layout>
                        <CreateUserPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users/edit/:id"
                  element={
                    <ProtectedRoute >
                      <Layout>
                        <EditUserPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users/:id"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <Layout>
                        <UserDetailsPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/categories"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <Layout>
                        <CategoriesPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/categories/create"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <Layout>
                        <CreateCategoryPage />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* Error Pages */}
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
