import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  /** Optional compact fallback label, e.g. "menu section" */
  label?: string;
}

interface State {
  hasError: boolean;
}

export class SectionErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[SectionErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='card p-6 text-center border-ob-border'>
          <p className='text-sm text-ob-muted'>
            Failed to load{this.props.label ? ` ${this.props.label}` : ' this section'}.{' '}
            <button onClick={() => this.setState({ hasError: false })} className='underline text-ob-caramel hover:text-ob-wood transition-colors'>
              Retry
            </button>
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
