"use client";

import Link from "next/link";
import MotionFadeUp from "../../Motions/MotionFadeUp";
import SectionContainer from "../../SectionLayout/SectionContainer";
import Button from "@/components/ui/Buttons/Button";
import IcTwinkle from "@/components/ui/icons/IcTwinkle";
import { motion } from "motion/react";

export default function FinalCtaSection() {
	return (
		<div className="bg-purple-50">
			<SectionContainer className="relative overflow-hidden py-20 md:py-52.5 lg:pb-42">
				<div className="absolute top-12 left-6 h-[72px] w-[64px] rotate-[42deg] md:top-28 md:left-10 md:h-[228px] md:w-[200px]">
					<div className="absolute inset-0 rounded-full bg-purple-100 opacity-30" />
					<div className="absolute inset-x-0 bottom-0 h-2/3 rounded-b-full bg-gradient-to-t from-purple-50 via-purple-50/80 to-transparent" />
				</div>
				<div className="absolute right-[0px] bottom-[-180px] h-[240px] w-[200px] rotate-[42deg] rounded-full bg-[#DCDAF9]/50" />
				<div className="absolute right-[100px] bottom-[-180px] h-[240px] w-[200px] rotate-[42deg] rounded-full bg-[#C9C4F4]/60" />

				<IcTwinkle color="#FCF0A2" className="absolute top-32 left-2 size-11 md:hidden" />
				<IcTwinkle className="absolute top-10 right-10 hidden size-11 rotate-[5deg] md:block" />
				<IcTwinkle className="absolute top-1/2 left-12 hidden -translate-y-1/2 rotate-[-2deg] text-orange-500 md:block" />

				<div className="relative z-10 flex flex-col items-center justify-center text-center">
					<MotionFadeUp>
						<h2 className="text-xl font-bold text-gray-900 md:text-[48px] md:leading-15">
							지금 당신의 배터리를 충전하세요
						</h2>
					</MotionFadeUp>

					<MotionFadeUp delay={0.08}>
						<p className="mt-2 hidden text-2xl text-purple-600 lg:block">
							혼자 시작하기 어려웠던 일들, RE:BOOT 에서 함께해요
						</p>
					</MotionFadeUp>

					<MotionFadeUp delay={0.08}>
						<p className="mt-2 text-sm text-purple-600 md:text-2xl">
							새로운 모임, 새로운 에너지가 기다리고 있습니다
						</p>
					</MotionFadeUp>

					<MotionFadeUp delay={0.16}>
						<Link href="/meetup/list" className="flex w-full justify-center">
							<motion.div
								animate={{ scale: [1, 1.03, 1] }}
								transition={{
									duration: 1.5,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								whileTap={{ scale: 0.96 }}>
								<Button className="mt-10 h-12 w-35 text-base font-normal hover:text-white md:mt-16 md:h-15 md:w-42.5 md:text-xl">
									모임 찾아보기
								</Button>
							</motion.div>
						</Link>
					</MotionFadeUp>
				</div>
			</SectionContainer>
		</div>
	);
}
