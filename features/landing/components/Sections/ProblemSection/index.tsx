"use client";

import MotionFadeUp from "../../Motions/MotionFadeUp";
import { MotionItem } from "../../Motions/MotionItem";
import MotionStagger from "../../Motions/MotionStagger";
import SectionContainer from "../../SectionLayout/SectionContainer";
import SectionHeader from "../../SectionLayout/SectionHeader";
import { PROBLEM_CARDS } from "../data";
import ProblemCard from "./ProblemCard";

export default function ProblemSection() {
	return (
		<div className="flex justify-center bg-orange-50">
			<SectionContainer className="flex w-full flex-col items-center px-4 py-12.5 md:px-6 md:py-20 lg:py-37.5">
				<MotionFadeUp className="w-full text-center">
					<SectionHeader title="이런 고민 하고 계신가요?" />
				</MotionFadeUp>

				<MotionStagger className="my-12 grid w-full gap-4 md:grid-cols-3 lg:my-20">
					{PROBLEM_CARDS.map((card) => (
						<MotionItem key={card.title} className="flex justify-center">
							<ProblemCard {...card} />
						</MotionItem>
					))}
				</MotionStagger>

				<MotionFadeUp delay={0.12} className="flex w-full justify-center">
					<button className="w-full max-w-86.5 rounded-xl bg-orange-500 px-6 py-3 text-base whitespace-nowrap text-white md:w-fit md:max-w-none md:rounded-3xl md:px-6 md:py-8 md:text-2xl">
						&quot;지금 나는 새로운 활력이 필요합니다&quot;
					</button>
				</MotionFadeUp>
			</SectionContainer>
		</div>
	);
}
