"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { PAGE_INTRO_CONTENTS } from "@/constants/pageIntro";

const PAGE_INTRO_STYLE = {
	image: "h-14.25 w-17.5 md:h-22.75 md:w-24.25",
	title: "text-lg font-semibold text-gray-900 md:text-5xl md:mt-[0.563rem]",
	description: "text-base font-medium text-gray-500 md:text-xl",
};

export default function PageIntro() {
	const pathname = usePathname();
	const pageKey = pathname.split("/")[1];

	const content = PAGE_INTRO_CONTENTS[pageKey];

	if (!content) return null;

	return (
		<div className="flex shrink-0 gap-3 md:gap-6.5">
			{content.imageSrc && (
				<div className="shrink-0">
					<Image
						src={content.imageSrc}
						alt={content.imageAlt ?? content.title}
						width={97}
						height={91}
						className={`${PAGE_INTRO_STYLE.image} object-contain`}
					/>
				</div>
			)}

			<div className="flex flex-col justify-between select-none">
				<h1 className={PAGE_INTRO_STYLE.title}>{content.title}</h1>
				<p className={PAGE_INTRO_STYLE.description}>{content.description}</p>
			</div>
		</div>
	);
}
