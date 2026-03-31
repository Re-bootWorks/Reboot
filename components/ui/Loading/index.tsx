import LoaderDots, { SIZE_MAP } from "@/components/ui/LoaderDots";

export default function Loading({ size = "lg" }: { size?: keyof typeof SIZE_MAP }) {
	return (
		<div className="flex justify-center py-4">
			<LoaderDots size={size} />
		</div>
	);
}
