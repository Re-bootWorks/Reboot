interface LoaderDotsProps {
	size?: keyof typeof SIZE_MAP | number | `${number}px` | `${number}%`;
	className?: string;
}

export default function LoaderDots({
	size = "md",
	className = "fill-purple-500",
}: LoaderDotsProps) {
	return (
		<svg
			width={SIZE_MAP[size as keyof typeof SIZE_MAP] ?? size}
			viewBox="0 0 60 20"
			xmlns="http://www.w3.org/2000/svg">
			<circle cx="15" cy="10" r="2" className={className}>
				<animate
					attributeName="r"
					values="2;4;2"
					keyTimes="0;0.5;1"
					keySplines="0.25 0.1 0.25 1;0.25 0.1 0.25 1"
					calcMode="spline"
					dur="1s"
					repeatCount="indefinite"
					begin="0s"
				/>
				<animate
					attributeName="opacity"
					values="0.3;1;0.3"
					keyTimes="0;0.5;1"
					keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
					calcMode="spline"
					dur="1s"
					repeatCount="indefinite"
					begin="0s"
				/>
			</circle>
			<circle cx="30" cy="10" r="2" className={className}>
				<animate
					attributeName="r"
					values="2;4;2"
					keyTimes="0;0.5;1"
					keySplines="0.25 0.1 0.25 1;0.25 0.1 0.25 1"
					calcMode="spline"
					dur="1s"
					repeatCount="indefinite"
					begin="0.15s"
				/>
				<animate
					attributeName="opacity"
					values="0.3;1;0.3"
					keyTimes="0;0.5;1"
					keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
					calcMode="spline"
					dur="1s"
					repeatCount="indefinite"
					begin="0.15s"
				/>
			</circle>
			<circle cx="45" cy="10" r="2" className={className}>
				<animate
					attributeName="r"
					values="2;4;2"
					keyTimes="0;0.5;1"
					keySplines="0.25 0.1 0.25 1;0.25 0.1 0.25 1"
					calcMode="spline"
					dur="1s"
					repeatCount="indefinite"
					begin="0.3s"
				/>
				<animate
					attributeName="opacity"
					values="0.3;1;0.3"
					keyTimes="0;0.5;1"
					keySplines="0.42 0 0.58 1;0.42 0 0.58 1"
					calcMode="spline"
					dur="1s"
					repeatCount="indefinite"
					begin="0.3s"
				/>
			</circle>
		</svg>
	);
}

const SIZE_MAP = {
	xxs: 20,
	xs: 40,
	sm: 60,
	md: 80,
	lg: 100,
	xl: 120,
	xxl: 140,
} as const;
