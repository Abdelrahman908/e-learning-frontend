import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ErrorBoundary from './utils/ErrorBoundary';
import { CourseProvider } from "./contexts/CourseContext";
// استيراد ملفات CSS الخاصة بالمشروع هنا
import './index.css';
import './assets/styles/global.css';
import { ChatProvider } from "./contexts/ChatContext";  // تأكد من المسار الصحيح

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <CourseProvider>
        <ChatProvider>     {/* أضفت الـ ChatProvider هنا */}
          <App />
        </ChatProvider>
      </CourseProvider>
    </AuthProvider>
  </BrowserRouter>
);

