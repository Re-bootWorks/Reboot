"use client";

import Image from "next/image";
import MotionFadeUp from "../../Motions/MotionFadeUp";
import SectionContainer from "../../SectionLayout/SectionContainer";
import { MotionItem } from "../../Motions/MotionItem";
import { SOLUTION_ITEMS } from "../data";
import MotionFadeLeftToRight from "../../Motions/MotionFadeLeftToRight";
import MotionFadeRightToLeft from "../../Motions/MotionFadeRightToLeft";

export default function SolutionSection() {
	return (
		<div className="bg-purple-50">
			<SectionContainer className="py-12.5 md:py-20 lg:py-37.5">
				<div className="grid items-center gap-10 md:grid-cols-2">
					<MotionFadeLeftToRight>
						<div className="flex items-center justify-center">
							<Image
								src="/assets/img/img_blue_people.svg"
								alt="여럿이 사진 찍는 이미지"
								width={400}
								height={600}
								className="h-49 w-35 md:size-70 lg:size-96"
							/>
						</div>
					</MotionFadeLeftToRight>

					<div>
						<MotionFadeUp className="flex" delay={0.08}>
							<span className="text-xl font-bold whitespace-pre-line text-gray-800 md:text-4xl md:text-[40px] md:leading-14">
								<span className="text-purple-500">RE:BOOT</span>
								{"는\n당신의 일상을 바꿔주는\n도움을 연결합니다"}
							</span>
						</MotionFadeUp>

						<MotionFadeUp delay={0.16}>
							<p className="mt-6 text-sm leading-6 whitespace-pre-line text-gray-600 md:text-xl">
								{
									"작은 한  걸음도 혼자가 아니면 가벼워집니다.\n당신의 첫 모임, RE:BOOT가 도와드릴게요."
								}
							</p>
						</MotionFadeUp>

						<MotionFadeRightToLeft className="mt-12 flex flex-col gap-6 md:mt-10">
							{SOLUTION_ITEMS.map((item) => (
								<MotionItem key={item.title}>
									<div className="flex items-center gap-6 rounded-3xl bg-white/70 p-4 shadow-[0_4px_16px_0_rgba(0,0,0,0.2)] md:px-6 md:py-8">
										<div className="h-fit w-fit shrink-0 rounded-2xl bg-purple-100 p-5">
											<item.icon />
										</div>
										<div className="grid gap-2">
											<p className="text-base text-gray-900 md:text-xl">{item.title}</p>
											<p className="text-sm text-gray-700 md:text-base">{item.description}</p>
										</div>
									</div>
								</MotionItem>
							))}
						</MotionFadeRightToLeft>
					</div>
				</div>
			</SectionContainer>
		</div>
	);
}
