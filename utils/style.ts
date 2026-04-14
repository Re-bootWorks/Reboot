export function getBreakpoint(breakpoint: "sm" | "md" | "lg") {
	if (typeof window === "undefined") return "";

	const varName = `--breakpoint-${breakpoint}`;
	const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
	return value ? `(min-width: ${value})` : "";
}
