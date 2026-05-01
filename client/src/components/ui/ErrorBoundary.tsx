"use client";

import React, { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-500">
            <AlertTriangle size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-secondary">Oops, something went wrong</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              We encountered an unexpected error. Please try refreshing the page or contact support if the issue persists.
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
