import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * CustomToastContainer is a reusable and styled toast notification container
 * used globally in the app to display user feedback and alerts.
 */
const CustomToastContainer = () => {
  return (
    <ToastContainer
      position="top-right"          // Show toasts in the top-right corner
      autoClose={4000}              // Auto-close after 4 seconds
      hideProgressBar={false}       // Show progress bar
      newestOnTop                   // Show newest toast on top
      closeOnClick                  // Allow closing on click
      rtl={false}                   // Not using RTL layout
      pauseOnFocusLoss             // Pause timer when window loses focus
      draggable                    // Allow dragging toast
      pauseOnHover                 // Pause timer on hover
      theme="light"                // Use light theme (can be dynamic)
    />
  );
};

export default CustomToastContainer;
