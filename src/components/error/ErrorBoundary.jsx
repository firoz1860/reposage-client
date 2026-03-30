import React from "react";
import ErrorFallback from "./ErrorFallback";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error, info) {
    fetch("/api/logs/client-error", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: error?.toString?.() || "Unknown client error",
        info,
        url: window.location.href
      })
    }).catch(() => {});
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
