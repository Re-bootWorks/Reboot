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
			<SectionContainer className="overflow-hidden px-[47.5px] pt-12.5 md:pt-20 lg:pt-53">
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

					<MotionFadeUp delay={0.24}>
						<Link href="/meetup/list" className="flex w-full justify-center">
							<motion.div
								animate={{ rotate: [0, 0, 0, -2, 2, -2, 2, 0] }}
								transition={{
									duration: 0.8,
									repeat: Infinity,
									repeatDelay: 2.3,
									ease: "easeInOut",
								}}
								whileTap={{ scale: 0.97 }}>
								<Button className="mt-10 h-12 w-35 rounded-2xl border border-white/20 bg-gradient-to-b from-purple-700 via-purple-500 to-purple-400 text-base font-normal text-white shadow-[inset_0_1.5px_0_rgba(255,255,255,0.35),inset_0_-2px_0_rgba(42,25,125,0.35),0_10px_20px_rgba(69,44,192,0.28)] transition-all duration-200 [text-shadow:0_1px_1px_rgba(15,7,58,0.28)] hover:text-white hover:shadow-[inset_0_1.5px_0_rgba(255,255,255,0.38),inset_0_-2px_0_rgba(42,25,125,0.4),0_0_0_1px_rgba(255,255,255,0.06),0_0_18px_rgba(117,102,229,0.22),0_14px_28px_rgba(69,44,192,0.36)] active:translate-y-[1px] md:mt-16 md:h-15 md:w-42.5 md:text-xl">
									모임 찾아보기
								</Button>
							</motion.div>
						</Link>
					</MotionFadeUp>
				</div>
			</SectionContainer>

			<Image
				src="/assets/img/img_plug_battery.svg"
				alt="충전 플러그 꽂는 이미지"
				width={524}
				height={660}
				className="mt-15 h-auto w-93 max-w-full md:w-[32.75rem]"
			/>

			<motion.div
				animate={{ opacity: [0.7, 1, 0.7] }}
				transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
				<IcChevronDownDouble className="mt-10 md:mt-19 md:mb-4.5 lg:mt-32 lg:mb-30" />
			</motion.div>
		</motion.section>
	);
}
