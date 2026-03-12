import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcBellUnreadOutline({
	color = "gray-600",
	pointColor = "purple-500",
	size = "md", // "md", "sm"
	...props
}: IconProps) {
	const attrs = resolveIconAttr({ stroke: color, fill: pointColor, size });
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={attrs.size}
			height={attrs.size}
			viewBox="0 0 24 24"
			{...props}
			fill="none">
			<path
				d="M18 8C18 11.0902 18.7795 13.206 19.6504 14.6054C20.3849 15.7859 20.7522 16.3761 20.7387 16.5408C20.7238 16.7231 20.6852 16.7926 20.5382 16.9016C20.4056 17 19.8074 17 18.6112 17H5.38887C4.19261 17 3.59448 17 3.46179 16.9016C3.31488 16.7926 3.27626 16.7231 3.26134 16.5408C3.24788 16.3761 3.61515 15.7859 4.34968 14.6054C5.22049 13.206 6.00002 11.0902 6.00002 8C6.00002 6.4087 6.63216 4.88258 7.75738 3.75736C8.8826 2.63214 10.4087 2 12 2M9.35419 21C10.0593 21.6224 10.9856 22 12 22C13.0145 22 13.9407 21.6224 14.6458 21"
				stroke={attrs.stroke}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<circle cx="17" cy="3" r="3" fill={attrs.fill} />
		</svg>
	);
}
