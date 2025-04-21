import React, { Suspense } from 'react';
import FrenchModelScene from './FrenchModelScene';
import './3DSceneStyles.css';

// Simple loading indicator
const Loader = () => {
  return (
    <div className="scene-loading">
      <div className="loading-text">Loading French Treasures...</div>
      <div className="loading-spinner"></div>
    </div>
  );
};

// Error fallback
const ErrorFallback = () => {
  return (
    <div className="scene-container error-container">
      <div className="error-message">
        Could not load 3D scene
      </div>
    </div>
  );
};

// Loader wrapper component
const ModelLoader = () => {
  return (
    <div className="scene-container">
      <Suspense fallback={<Loader />}>
        <ErrorBoundary fallback={<ErrorFallback />}>
          <FrenchModelScene />
        </ErrorBoundary>
      </Suspense>
      <div className="flag-strip"></div>
    </div>
  );
};

// Simple error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error in 3D scene:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ModelLoader; 