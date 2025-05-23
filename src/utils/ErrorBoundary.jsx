import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Alert, Result } from 'antd';

// Recommended class version with enhanced features
export default class ErrorBoundary extends React.Component {
  state = { 
    hasError: false,
    error: null,
    errorInfo: null 
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary caught:", error, errorInfo);
    this.setState({ errorInfo });
    // Log to error monitoring service (e.g., Sentry)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary p-4">
          <Result
            status="error"
            title="Unexpected Error"
            subTitle={this.state.error?.message || 'Please try again later'}
            extra={[
              <Button 
                type="primary" 
                key="console" 
                onClick={this.handleReset}
              >
                Retry
              </Button>,
              <Button 
                key="home" 
                onClick={() => window.location.href = '/'}
              >
                Back Home
              </Button>,
            ]}
          />
          {process.env.NODE_ENV === 'development' && (
            <Alert
              type="error"
              message="Error Details"
              description={
                <pre className="text-xs">
                  {this.state.error?.stack}
                  {this.state.errorInfo?.componentStack}
                </pre>
              }
              className="mt-4"
            />
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

// Hook version with additional capabilities
export const ErrorBoundaryHook = ({ children, fallback }) => {
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  const resetError = () => {
    setError(null);
    window.location.reload();
  };

  React.useEffect(() => {
    const errorHandler = (event) => {
      setError(event.error || new Error('Unknown error'));
      event.preventDefault();
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (error) {
    return fallback ? fallback({ error, resetError }) : (
      <div className="error-boundary p-4">
        <Result
          status="error"
          title="Application Error"
          subTitle={error.message}
          extra={[
            <Button type="primary" key="retry" onClick={resetError}>
              Reload
            </Button>,
            <Button key="home" onClick={() => navigate('/')}>
              Home
            </Button>,
          ]}
        />
      </div>
    );
  }

  return children;
};