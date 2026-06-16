import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
          <h1 style={{ color: '#ef4444', fontSize: '20px', marginBottom: '12px' }}>Something went wrong</h1>
          <pre style={{ background: '#f1f5f9', padding: '16px', borderRadius: '8px', fontSize: '13px', overflow: 'auto', whiteSpace: 'pre-wrap', color: '#333' }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack?.split('\n').slice(0, 6).join('\n')}
          </pre>
          <button
            onClick={() => { localStorage.removeItem('flowboard-data-v2'); window.location.reload() }}
            style={{
              padding: '8px 16px', background: '#6366f1', color: 'white', border: 'none',
              borderRadius: '6px', cursor: 'pointer', fontSize: '14px', marginTop: '16px',
            }}
          >
            Clear Data & Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
