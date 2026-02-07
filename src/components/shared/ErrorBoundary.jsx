'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center bg-royal-deep text-white p-8">
          <div className="max-w-md text-center">
            <AlertTriangle className="w-16 h-16 text-brand-gold mx-auto mb-4" />
            <h2 className="text-2xl font-cinzel font-bold mb-3">
              {this.props.title || 'Something went wrong'}
            </h2>
            <p className="text-zinc-400 mb-6">
              {this.props.message || 'We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.'}
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold text-black font-bold rounded-lg hover:bg-brand-gold/90 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left bg-black/30 p-4 rounded-lg">
                <summary className="cursor-pointer text-sm font-mono text-red-400 mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs text-zinc-400 overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
