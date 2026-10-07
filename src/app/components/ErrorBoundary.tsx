import { Component, type ErrorInfo, type ReactNode } from 'react';
import { TriangleAlert } from 'lucide-react';
import { Icon } from './Icon';

interface ErrorBoundaryProps {
    children: ReactNode;
    /** What failed, e.g. "This buffer" (default: the whole page) */
    what?: string;
    /** Changing it clears the error (e.g. the id of the buffer shown) */
    resetKey?: unknown;
}

interface ErrorBoundaryState {
    error: Error | null;
    resetKey: unknown;
}

/**
 * Shows an error instead of an empty page when rendering fails, with a way
 * to retry. The page keeps working around a failing part.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null, resetKey: this.props.resetKey };

    static getDerivedStateFromError(error: unknown): Partial<ErrorBoundaryState> {
        return { error: error instanceof Error ? error : new Error(String(error)) };
    }

    static getDerivedStateFromProps(
        props: ErrorBoundaryProps,
        state: ErrorBoundaryState,
    ): Partial<ErrorBoundaryState> | null {
        return props.resetKey !== state.resetKey
            ? { error: null, resetKey: props.resetKey }
            : null;
    }

    componentDidCatch(error: unknown, info: ErrorInfo): void {
        console.error('Rendering failed', error, info.componentStack);
    }

    render(): ReactNode {
        const { error } = this.state;
        if (!error) {
            return this.props.children;
        }
        const page = this.props.what === undefined;
        return (
            <div className="error-boundary alert alert-danger" role="alert">
                <Icon icon={TriangleAlert} />
                <div>
                    <strong>
                        {page ? 'Glowing Bear' : this.props.what} could not be
                        displayed.
                    </strong>{' '}
                    <span className="error-boundary-message">{error.message}</span>
                    <div className="mt-2 d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => this.setState({ error: null })}
                        >
                            Try again
                        </button>
                        {page && (
                            <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => location.reload()}
                            >
                                Reload
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
