import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 max-w-md w-full text-center border border-slate-100">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-rounded text-3xl">error</span>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-slate-500 font-medium mb-8">
              We encountered an unexpected issue while loading this page. 
              Our team has been notified.
            </p>
            
            <div className="flex flex-col gap-3">
                <button 
                onClick={() => window.location.reload()}
                className="w-full bg-slate-900 text-white font-bold py-3.5 px-6 rounded-2xl hover:bg-slate-800 transition-all font-outfit"
                >
                  Reload Page
                </button>
                <button 
                onClick={() => window.location.href = '/'}
                className="w-full bg-white text-slate-700 border border-slate-200 font-bold py-3.5 px-6 rounded-2xl hover:bg-slate-50 transition-all font-outfit"
                >
                  Go to Homepage
                </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
