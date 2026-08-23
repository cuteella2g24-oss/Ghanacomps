import { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * ErrorBoundary — a last line of defence so a render-time crash (e.g. a
 * hand-edited/corrupted KV content blob) degrades to a readable fallback
 * instead of a blank white screen. Class component because only class error
 * boundaries can catch render errors in React.
 */
interface Props { children: ReactNode }
interface State { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface it in the console for debugging; never swallow silently.
    console.error('[GhanaComps] render error caught by ErrorBoundary:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{
        minHeight: '100svh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 'var(--space-lg)',
        padding: 'var(--space-6xl) 5vw', textAlign: 'center',
      }}>
        <h1 style={{ fontFamily: 'var(--font-d)', fontSize: 'var(--fs-2xl)', color: 'var(--white)' }}>
          Something went wrong on this page.
        </h1>
        <p style={{ fontSize: 'var(--fs-md)', color: 'var(--body)', maxWidth: '48ch' }}>
          Please refresh, or head back to the home page. If it keeps happening, let us know.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              fontFamily: 'var(--font-b)', fontSize: 'var(--fs-sm)', cursor: 'pointer',
              background: 'var(--gold)', color: 'var(--on-gold)', border: 'none',
              borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm) var(--space-2xl)',
              letterSpacing: 'var(--ls-2)', textTransform: 'uppercase',
            }}
          >
            Refresh
          </button>
          <a
            href="/"
            style={{
              fontFamily: 'var(--font-b)', fontSize: 'var(--fs-sm)',
              color: 'var(--white)', border: '1px solid var(--line)',
              borderRadius: 'var(--radius-sm)', padding: 'var(--space-sm) var(--space-2xl)',
              letterSpacing: 'var(--ls-2)', textTransform: 'uppercase', textDecoration: 'none',
            }}
          >
            Home
          </a>
        </div>
      </div>
    );
  }
}
