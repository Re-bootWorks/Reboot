import { cn } from "@/utils/cn";
import Image from "next/image";

interface AvatarProps {
	/** 이미지 URL */
	src: string | null;
	/** 렌더링 될 가장 큰 이미지 width */
	width: number;
	/** 렌더링 될 가장 큰 이미지 height */
	height: number;
	/** 반응형 Size 추가 */
	className?: string;
}
const DEFAULT_AVATAR_IMAGE = "/assets/img/img_profile.svg";

export default function Avatar({ src, width, height, className }: AvatarProps) {
	const imageSrc = src?.trim() ? src : DEFAULT_AVATAR_IMAGE;

	return (
		<Image
			src={imageSrc ?? DEFAULT_AVATAR_IMAGE}
			alt="프로필 이미지"
			className={cn("rounded-full border border-gray-200 object-cover", className)}
			width={width}
			height={height}
		/>
	);
}
