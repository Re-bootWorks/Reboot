import LoaderDots from "@/components/ui/LoaderDots";

export default function Loading() {
	return (
		<div className="flex justify-center py-4">
			<LoaderDots size="xl" className="fill-gray-600" />
		</div>
	);
}
