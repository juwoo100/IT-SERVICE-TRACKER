import * as React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, info) {
        console.error("ErrorBoundary cought an error:", error, info);
    }
    render() {
        if (this.state.hasError) {
            return (this.props.fallback || (
                <div className="p-4 boarder boarder-red-300 rounded bg-red-50 text-red-600">
                    <p>Something went wrong while rendering this component.</p>
                    <pre className="text-xs whitespace-pre-wrap">
                        {this.state.error?.message}
                    </pre>
                </div>
            )
            );
        }
        return this.props.children;
    }
}