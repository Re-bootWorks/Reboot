import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcPerson({
	color = "gray-500",
	size = "xxs", // "xxs"
	...props
}: IconProps) {
	const attrs = resolveIconAttr({ fill: color, size });
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={attrs.size}
			height={attrs.size}
			viewBox="0 0 16 16"
			{...props}
			fill="none">
			<circle cx="8.00016" cy="5.33366" r="2.66667" fill={attrs.fill} />
			<path
				d="M3.55875 11.5469C3.99947 9.68441 5.84798 8.6665 7.76188 8.6665H8.23844C10.1523 8.6665 12.0009 9.68441 12.4416 11.5469C12.5268 11.9073 12.5946 12.2844 12.6328 12.6676C12.6692 13.034 12.3684 13.3332 12.0002 13.3332H4.00016C3.63197 13.3332 3.33111 13.034 3.36757 12.6676C3.4057 12.2844 3.47348 11.9073 3.55875 11.5469Z"
				fill={attrs.fill}
			/>
		</svg>
	);
}
