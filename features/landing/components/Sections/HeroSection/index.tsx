"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { IcChevronDownDouble, IcLightning } from "@/components/ui/icons";
import MotionFadeUp from "../../Motions/MotionFadeUp";
import SectionContainer from "../../SectionLayout/SectionContainer";
import TypingText from "./TypingText";
import Button from "@/components/ui/Buttons/Button";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
	const sectionRef = useRef<HTMLElement>(null);

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end start"],
	});

	const bottomColor = useTransform(scrollYProgress, [0, 0.35], ["#0F073A", "#FFF4ED"]);
	const backgroundImage = useMotionTemplate`linear-gradient(180deg, #0F073A 0%, ${bottomColor} 100%)`;

	return (
		<motion.section
			className="flex w-full flex-col items-center justify-center"
			ref={sectionRef}
			style={{ backgroundImage }}>
			<SectionContainer className="px-[47.5px] pt-12.5 md:pt-20 lg:pt-53">
				<div className="flex flex-col items-center justify-center gap-6 text-center lg:gap-8">
					<MotionFadeUp className="flex flex-col justify-center gap-6 lg:gap-8">
						<div className="flex shrink-0 items-center gap-2.5 rounded-full bg-orange-200 px-3 py-1.5">
							<IcLightning />
							<span className="text-xs font-normal whitespace-nowrap text-orange-600 md:text-sm">
								당신의 에너지를 채워주는 모임 플랫폼
							</span>
						</div>
						<span className="font-tektur text-5xl text-purple-200 md:text-6xl">RE : BOOT</span>
					</MotionFadeUp>

					<MotionFadeUp delay={0.08}>
						<h1 className="flex min-h-43 flex-col items-center gap-2.5 text-center text-5xl font-bold text-white md:min-h-31 md:text-6xl lg:min-h-17 lg:flex-row lg:gap-0">
							<span className="flex flex-col items-center gap-2.5 md:flex-row md:gap-0">
								<TypingText text="오늘 당신의" delay={0} wrapperClassName="md:mr-3" />
								<TypingText
									text="배터리는"
									className="bg-[linear-gradient(90deg,#E65217_0%,#604CDE_100%)] bg-clip-text text-transparent"
									delay={0.5}
									wrapperClassName="md:mr-0 lg:mr-3"
								/>
							</span>

							<TypingText text="몇 %인가요?" delay={1} showCursor cursorClassName="bg-white" />
						</h1>
					</MotionFadeUp>

					<MotionFadeUp delay={0.16}>
						<span className="text-base tracking-wide text-white md:text-xl">
							<p>지친 일상에 새로운 에너지를 채워보세요</p>
							<p>
								<b>RE:BOOT</b>가 당신의 일상을 다시 켭니다
							</p>
						</span>
					</MotionFadeUp>

					<MotionFadeUp delay={0.24} className="w-full">
						<Link href="/meetup/list" className="flex w-full justify-center">
							<Button className="mt-1.5 h-10 w-full cursor-pointer rounded-lg text-sm font-normal transition-transform duration-400 hover:text-white active:scale-95 md:mt-4 md:h-15 md:w-60 md:rounded-2xl md:text-xl">
								모임 찾아보기
							</Button>
						</Link>
					</MotionFadeUp>
				</div>
			</SectionContainer>

			<Image
				src="/assets/img/img_plug_battery.svg"
				alt="충전 플러그 꽂는 이미지"
				width={524}
				height={660}
				className="mt-15 h-auto w-93 md:w-[32.75rem]"
			/>

			<motion.div
				animate={{ opacity: [0.7, 1, 0.7] }}
				transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
				<IcChevronDownDouble className="mt-10 md:mt-19 md:mb-4.5 lg:mt-32 lg:mb-30" />
			</motion.div>
		</motion.section>
	);
}
