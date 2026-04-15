import resolveIconAttr, { IconProps } from "@/utils/resolveIconAttr";

export default function IcLightning({ color = "orange-600", size = "xxs", ...props }: IconProps) {
	const attrs = resolveIconAttr({ from: color, to: color, size });

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={attrs.size}
			height={attrs.size}
			viewBox="0 0 9 17"
			{...props}
			fill="none">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M2.52312 9.91223H3.89322C4.12892 9.91223 4.24682 9.91223 4.32002 9.98543C4.39322 10.0586 4.39322 10.1765 4.39322 10.4122V14.8421C4.39322 15.7327 4.39322 16.1781 4.58942 16.2213C4.78572 16.2645 4.97272 15.8604 5.34692 15.0521L8.07832 9.15243C8.67002 7.87433 8.96582 7.23533 8.67092 6.77373C8.37602 6.31223 7.67182 6.31223 6.26332 6.31223H4.89322C4.65752 6.31223 4.53962 6.23903 4.46642 6.23903C4.39322 6.16582 4.39322 6.04793 4.39322 5.81223V1.38236C4.39322 0.491686 4.39322 0.0463553 4.19702 0.0031353C4.00072 -0.0400747 3.81372 0.364045 3.43952 1.17229L0.708152 7.07193C0.116432 8.35013 -0.179427 8.98913 0.115503 9.45073C0.410433 9.91223 1.11465 9.91223 2.52312 9.91223Z"
				fill={attrs.from}
			/>
		</svg>
	);
}
