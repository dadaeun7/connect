"use client";

import React, { ErrorInfo, ReactNode, Component } from "react";
import CstAlert from "../CstAlert";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// 2. 클래스 컴포넌트를 함수 외부에 독립적으로 선언
class ErrorBoundaryClass extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <>
          {this.props.fallback ?? <div>Something went wrong.</div>}
          <CstAlert
            isOpen={this.state.hasError}
            message={this.state.error.message}
            type="error"
            onClose={this.handleReset}
          />
        </>
      );
    }

    return this.props.children;
  }
}

interface AsyncBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

export function AsyncBoundary({
  children,
  fallback,
  onError,
}: Readonly<AsyncBoundaryProps>) {
  return (
    <ErrorBoundaryClass fallback={fallback} onError={onError}>
      {children}
    </ErrorBoundaryClass>
  );
}
