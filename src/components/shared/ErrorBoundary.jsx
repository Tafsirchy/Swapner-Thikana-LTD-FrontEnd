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
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null });
                if (this.props.onReset) this.props.onReset();
              }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-gold text-royal-deep font-bold uppercase tracking-widest hover:bg-white hover:text-royal-deep transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left bg-black/40 border border-white/10 p-6 backdrop-blur-sm">
                <summary className="cursor-pointer text-xs font-mono text-red-400 mb-4 uppercase tracking-wider hover:text-red-300 transition-colors">
                  [ Developer Error Log ]
                </summary>
                <pre className="text-[10px] text-zinc-500 overflow-auto max-h-60 font-mono leading-relaxed custom-scrollbar">
                  {this.state.error && this.state.error.toString()}
                  {'\n'}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
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
