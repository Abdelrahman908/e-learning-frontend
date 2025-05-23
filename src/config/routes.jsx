// // src/config/routes.js
// import React, { lazy, Suspense } from 'react';
// import { Navigate } from 'react-router-dom';

// import ProtectedRoute from '../components/common/ProtectedRoute';
// import Layout from '../components/layout/Layout';
// import AuthPageLayout from '../components/layout/AuthPageLayout';
// import LoadingSpinner from '../components/ui/LoadingSpinner';
// import ErrorBoundary from '../utils/ErrorBoundary';

// const lazyLoad = (path) => {
//   const Component = lazy(() =>
//     import(`../pages/${path}`).catch(() => ({ default: () => <div>فشل تحميل المكون</div> }))
//   );
//   return (props) => (
//     <ErrorBoundary>
//       <Suspense fallback={<LoadingSpinner />}>
//         <Component {...props} />
//       </Suspense>
//     </ErrorBoundary>
//   );
// };

// // الصفحات الأساسية
// const Home = lazyLoad('Home');
// const CoursesPublic = lazyLoad('CoursesPublic');
// const CourseDetails = lazyLoad('student/CourseDetails');
// const NotFound = lazyLoad('NotFound');

// // صفحات تسجيل الدخول
// const Login = lazyLoad('auth/Login');
// const Register = lazyLoad('auth/Register');
// const ForgotPassword = lazyLoad('auth/ForgotPassword');
// const ResetPassword = lazyLoad('auth/ResetPassword');
// const ConfirmEmail = lazyLoad('auth/ConfirmEmail');

// // صفحات المستخدم
// const Profile = lazyLoad('Profile');

// // صفحات المدرس
// const InstructorDashboard = lazyLoad('instructor/InstructorDashboard');
// const InstructorCourses = lazyLoad('instructor/InstructorCourses');
// const CreateCourse = lazyLoad('instructor/CreateCourse');
// const UpdateCourse = lazyLoad('instructor/UpdateCourseWithImage');
// const InstructorAnalytics = lazyLoad('instructor/InstructorAnalytics');

// // صفحات الأدمن
// const AdminDashboard = lazyLoad('admin/AdminDashboard');
// const AdminUsers = lazyLoad('admin/AdminUsers');
// const AdminCourses = lazyLoad('admin/AdminCourses');

// // صفحات الطالب
// const StudentDashboard = lazyLoad('student/StudentDashboard');
// const StudentCourses = lazyLoad('student/StudentCourses');
// const LessonView = lazyLoad('student/LessonView');

// const routes = [
//   {
//     path: '/',
//     element: <Layout />, // الـ Layout يحتوي Navbar, Sidebar, Footer
//     children: [
//       { index: true, element: <Home /> },
//       { path: 'courses', element: <CoursesPublic /> },
//       { path: 'courses/:id', element: <CourseDetails /> },
//       { path: 'profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },

//       {
//         path: 'instructor',
//         element: <ProtectedRoute allowedRoles={['Instructor']} />,
//         children: [
//           { path: 'dashboard', element: <InstructorDashboard /> },
//           { path: 'courses', element: <InstructorCourses /> },
//           { path: 'courses/create', element: <CreateCourse /> },
//           { path: 'courses/edit/:id', element: <UpdateCourse /> },
//           { path: 'analytics', element: <InstructorAnalytics /> },
//         ],
//       },

//       {
//         path: 'admin',
//         element: <ProtectedRoute allowedRoles={['Admin']} />,
//         children: [
//           { path: 'dashboard', element: <AdminDashboard /> },
//           { path: 'users', element: <AdminUsers /> },
//           { path: 'courses', element: <AdminCourses /> },
//         ],
//       },

//       {
//         path: 'student',
//         element: <ProtectedRoute allowedRoles={['Student']} />,
//         children: [
//           { path: 'dashboard', element: <StudentDashboard /> },
//           { path: 'my-courses', element: <StudentCourses /> },
//           { path: 'lessons/:id', element: <LessonView /> },
//         ],
//       },

//       { path: '404', element: <NotFound /> },
//       { path: '*', element: <Navigate to="/404" replace /> },
//     ],
//   },

//   {
//     path: '/auth',
//     element: <AuthPageLayout />, // صفحة بدون Sidebar أو Navbar, فقط للصفحات auth
//     children: [
//       { path: 'login', element: <Login /> },
//       { path: 'register', element: <Register /> },
//       { path: 'forgot-password', element: <ForgotPassword /> },
//       { path: 'reset-password', element: <ResetPassword /> },
//       { path: 'confirm-email', element: <ConfirmEmail /> },
//     ],
//   },
// ];

// export default routes;
