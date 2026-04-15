import Image from "next/image";
import imgBannerLarge from "./assets/img_banner_large.svg";
import imgBannerSmall from "./assets/img_banner_small.svg";
import { cn } from "@/utils/cn";

export default function Banner({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"relative h-48 w-full shrink-0 overflow-hidden",
				"md:h-[244px] md:rounded-3xl lg:rounded-4xl",
				"bg-linear-to-br from-purple-100 to-purple-200",
				className,
			)}>
			<div className="absolute top-1/2 left-4 z-1 -translate-y-1/2 md:left-10 lg:left-14">
				<p
					className={cn(
						"text-sm leading-5 font-medium tracking-[-0.28px] text-purple-700",
						"md:mb-2.5 md:text-xl md:leading-[30px] md:tracking-[-0.4px]",
					)}>
					함께할 사람을 찾고 계신가요?
				</p>
				<p
					className={cn(
						"text-lg leading-7 font-semibold tracking-[-0.36px] text-black",
						"md:text-[34px] md:leading-9 md:tracking-[-1.02px]",
					)}>
					지금 모임에 참여해보세요
				</p>
			</div>
			<div
				className={cn(
					"absolute top-[10px] right-[-90px] h-[263px] w-[435px]",
					"md:top-[-25px] md:right-[-50px] md:h-[376px] md:w-[536px]",
					"lg:top-[-25px] lg:right-[80px] lg:h-[376px] lg:w-[536px]",
				)}>
				<Image
					fetchPriority="high"
					src={imgBannerSmall}
					alt="banner"
					fill
					className="md:hidden"
					sizes="435px"
					priority
				/>
				<Image
					fetchPriority="high"
					src={imgBannerLarge}
					alt="banner"
					fill
					className="hidden md:block"
					sizes="(max-width: 1280px) 468px, 536px"
					priority
				/>
			</div>
		</div>
	);
}
