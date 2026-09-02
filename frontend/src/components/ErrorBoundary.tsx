import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Optional custom fallback UI. Defaults to a centred error card. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * E3 — React Error Boundary
 * Catches unhandled render / lifecycle errors in the component tree below it
 * and renders a graceful fallback instead of a blank white screen.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeComponent />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // Log to console in development; in production you'd send to a monitoring service.
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-8">
            <h2 className="font-display text-2xl uppercase text-ink-900">
              Something went wrong
            </h2>
            <p className="mt-3 text-sm text-ink-900/60">
              An unexpected error occurred on this page. Try refreshing, or go back to the home
              page.
            </p>
            {this.state.message && (
              <p className="mt-2 rounded bg-red-100 px-3 py-2 font-mono text-xs text-red-700">
                {this.state.message}
              </p>
            )}
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="rounded-md border border-ink-900/20 px-4 py-2 text-sm font-medium text-ink-900 hover:bg-ink-900/5"
              >
                Try again
              </button>
              <a
                href="/"
                className="rounded-md bg-pitch-500 px-4 py-2 text-sm font-medium text-white hover:bg-pitch-600"
              >
                Go home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
