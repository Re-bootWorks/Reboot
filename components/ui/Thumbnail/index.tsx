import { cn } from "@/utils/cn";
import Image from "next/image";

interface ThumbnailProps {
	/** 이미지 URL */
	src: string | null;
	/** 렌더링 될 가장 큰 이미지 width */
	width: number;
	/** 렌더링 될 가장 큰 이미지 height */
	height: number;
	/** 커스텀 스타일 추가 */
	className?: string;
	/** 이미지 설명 */
	alt?: string;
}
const DEFAULT_THUMBNAIL_IMAGE = "/assets/img/img_empty_purple.svg";

export default function Thumbnail({
	src,
	width,
	height,
	className,
	alt = "썸네일 이미지",
}: ThumbnailProps) {
	const hasSrc = src?.trim();
	const imageSrc = hasSrc || DEFAULT_THUMBNAIL_IMAGE;
	return (
		<Image
			src={imageSrc}
			alt={alt}
			className={cn(!!hasSrc ? "object-cover" : "bg-purple-50 object-scale-down p-1", className)}
			width={width}
			height={height}
		/>
	);
}
