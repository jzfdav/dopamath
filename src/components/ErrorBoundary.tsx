import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw, Copy, Check } from "lucide-react";
import { Button } from "./Button";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            copied: false
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.group("🚨 CRASH REPORT 🚨");
        console.error("Error:", error);
        console.error("Stack Trace:", errorInfo.componentStack);
        console.groupEnd();

        this.setState({ errorInfo });
    }

    handleReload = () => {
        window.location.reload();
    };

    handleCopy = () => {
        const { error, errorInfo } = this.state;
        const text = `DopaMath Crash Report\n\nError: ${error?.message}\n\nStack Trace:\n${errorInfo?.componentStack || "Not available"}\n\nTime: ${new Date().toISOString()}`;

        navigator.clipboard.writeText(text).then(() => {
            this.setState({ copied: true });
            setTimeout(() => this.setState({ copied: false }), 2000);
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center w-full h-screen bg-background p-6 text-center">
                    <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-6 animate-pulse">
                        <AlertTriangle size={48} className="text-red-500" />
                    </div>

                    <h1 className="text-4xl font-black text-white mb-2">
                        System Failure
                    </h1>

                    <p className="text-text-dim mb-8 max-w-md">
                        Something went wrong. The error has been logged.
                        <br />
                        <span className="text-xs font-mono bg-black/30 px-2 py-1 rounded mt-2 inline-block text-red-400 select-text">
                            {this.state.error?.message || "Unknown Error"}
                        </span>
                    </p>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="lg"
                            onClick={this.handleCopy}
                            className="flex items-center gap-2 bg-white/5 hover:bg-white/10"
                        >
                            {this.state.copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                            {this.state.copied ? "Copied" : "Copy Logs"}
                        </Button>

                        <Button
                            variant="primary"
                            size="lg"
                            onClick={this.handleReload}
                            className="flex items-center gap-2"
                        >
                            <RotateCcw size={20} />
                            Reload System
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
