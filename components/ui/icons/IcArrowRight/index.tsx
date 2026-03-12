import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcArrowRight({
	color = "gray-800",
	size = "md", // "md"
	...props
}: IconProps) {
	const attrs = resolveIconAttr({ fill: color, size });
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={attrs.size}
			height={attrs.size}
			viewBox="0 0 24 24"
			{...props}
			fill="none">
			<path
				d="M16.323 11.7253C16.6231 12.0429 16.6231 12.5396 16.323 12.8572L10.8637 18.6357C10.3517 19.1777 9.44053 18.8153 9.44053 18.0698L9.44053 6.51279C9.44053 5.76723 10.3517 5.40488 10.8637 5.94683L16.323 11.7253Z"
				fill={attrs.fill}
			/>
		</svg>
	);
}
