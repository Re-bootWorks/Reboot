import Image from "next/image";
import imgBannerLarge from "../assets/img_banner_large.svg";
import imgBannerSmall from "../assets/img_banner_small.svg";
import { cn } from "@/utils/cn";

export default function Banner() {
	return (
		<div
			className={cn(
				"relative h-48 w-full overflow-hidden bg-purple-100",
				"md:h-[244px] md:rounded-3xl lg:rounded-4xl",
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
					"absolute top-[35px] right-[-106px] h-[205px] w-[352px]",
					"md:top-[28px] md:right-[-95px] md:h-[273px] md:w-[468px]",
					"lg:top-2 lg:right-[84px] lg:h-[313.143px] lg:w-[536px]",
				)}>
				<Image src={imgBannerSmall} alt="banner" fill className="md:hidden" />
				<Image src={imgBannerLarge} alt="banner" fill className="hidden md:block" />
			</div>
		</div>
	);
}
