"use client";

import { type ReactNode, Component } from "react";

interface Props {
	children: ReactNode;
	fallback: ReactNode;
	className?: string;
}

export default class SectionErrorBoundary extends Component<Props, { hasError: boolean }> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: Error) {
		console.error("Section Error:", error);
	}

	resetError = () => {
		this.setState({ hasError: false });
	};

	render() {
		if (this.state.hasError) {
			return (
				<div
					className={`rounded-lg border bg-red-50 p-4 text-red-700 ${this.props.className || ""}`}>
					{this.props.fallback}
					<button
						onClick={this.resetError}
						className="mt-2 rounded bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200">
						다시 시도
					</button>
				</div>
			);
		}
		return this.props.children;
	}
}
