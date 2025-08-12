import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0f0f0f',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Arial, sans-serif',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{color: '#ff0000', fontSize: '2rem', margin: '0 0 20px 0'}}>YouTube</h1>
          <h2 style={{fontSize: '1.2rem', margin: '0 0 10px 0'}}>アプリケーションエラー</h2>
          <p style={{color: '#aaa', margin: '0 0 20px 0'}}>アプリケーションの読み込み中にエラーが発生しました。</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#ff0000',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            再読み込み
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Ensure DOM is ready
function initApp() {
  const root = document.getElementById('root');
  if (!root) {
    console.error('Root element not found');
    return;
  }

  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize React app:', error);
    // Fallback HTML rendering
    root.innerHTML = `
      <div style="min-height: 100vh; background-color: #0f0f0f; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: Arial, sans-serif; padding: 20px; text-align: center;">
        <h1 style="color: #ff0000; font-size: 2rem; margin: 0 0 20px 0;">YouTube</h1>
        <h2 style="font-size: 1.2rem; margin: 0 0 10px 0;">初期化エラー</h2>
        <p style="color: #aaa; margin: 0 0 20px 0;">アプリケーションの初期化に失敗しました。</p>
        <button onclick="window.location.reload()" style="background-color: #ff0000; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px;">再読み込み</button>
      </div>
    `;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}