export default function resolveIconAttr({ stroke, fill, from, to, size, ...props }: Props) {
	return {
		fill: resolveColor(fill),
		stroke: resolveColor(stroke),
		from: resolveColor(from),
		to: resolveColor(to),
		size: resolveSize(size),
		...props,
	};
}
export interface IconProps extends React.SVGProps<SVGSVGElement> {
	color?: Color;
	pointColor?: Color;
	size?: Size;
	isGradient?: boolean;
}
export const GRADIENT_MAP: Record<string, string> = {
	// --gradient-purple-100-lr, --gradient-purple-100-td
	"purple-50": "purple-100",
	// --gradient-purple-200-lr
	"purple-100": "purple-200",
	// --gradient-purple-200-rl
	"purple-200": "purple-100",
	// --gradient-purple-500
	"purple-400": "purple-700",
};

const SIZE_MAP = {
	xxs: 16,
	xs: 18,
	sm: 20,
	md: 24,
	lg: 32,
	xl: 40,
	xxl: 42,
} as const;
type Color = string;
type Size = keyof typeof SIZE_MAP | number | `${number}%` | `${number}px`;
interface Props {
	fill?: Color;
	stroke?: Color;
	from?: Color;
	to?: Color;
	size: Size;
}

function resolveColor(value: Color | undefined): Color {
	if (!value) return "currentColor";
	// hex, rgb, none, transparent
	if (
		value.startsWith("#") ||
		value.startsWith("rgb") ||
		value === "none" ||
		value === "transparent"
	) {
		return value;
	}
	// css variable
	return `var(--color-${value})`;
}

function resolveSize(value: Size): Size {
	if (value in SIZE_MAP) return SIZE_MAP[value as keyof typeof SIZE_MAP];
	return value;
}
