type EmptyImageProps = {
	size?: "sm" | "md" | "lg";
};

export default function EmptyImage({ size = "md" }: EmptyImageProps) {
	const sizeStyle = {
		sm: "max-w-[60px] max-h-[40px]",
		md: "max-w-[120px] max-h-[80px]",
		lg: "max-w-[180px] max-h-[120px]",
	};

	return (
		<div className="flex h-full w-full items-center justify-center bg-[#F0EFFC]">
			<img
				src="/assets/img/img_empty_purple.svg"
				alt="empty"
				className={`object-contain ${sizeStyle[size]}`}
			/>
		</div>
	);
}
