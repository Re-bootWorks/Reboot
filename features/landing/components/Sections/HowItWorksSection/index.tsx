"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import SectionContainer from "../../SectionLayout/SectionContainer";
import SectionHeader from "../../SectionLayout/SectionHeader";
import StepCard from "./StepCard";
import { HOW_IT_WORKS_STEPS } from "../data";

export default function HowItWorksSection() {
	const sectionRef = useRef<HTMLElement | null>(null);
	const [activeIndex, setActiveIndex] = useState(0);

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end end"],
	});

	useMotionValueEvent(scrollYProgress, "change", (value) => {
		const lastIndex = HOW_IT_WORKS_STEPS.length - 1;
		const nextIndex = Math.min(lastIndex, Math.round(value * lastIndex));

		setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
	});

	return (
		<section ref={sectionRef} className="relative bg-gray-50">
			<div className="relative" style={{ height: `${HOW_IT_WORKS_STEPS.length * 100}vh` }}>
				<div className="sticky top-0 flex h-screen items-center overflow-hidden">
					<SectionContainer className="w-full px-6 py-12 md:px-12 md:py-10">
						<SectionHeader
							title="충전은 이렇게 시작됩니다"
							description="RE:BOOT와 함께하는 5단계 여정"
						/>

						<div className="mt-10 md:mt-12">
							<StepCard steps={HOW_IT_WORKS_STEPS} activeIndex={activeIndex} />
						</div>
					</SectionContainer>
				</div>
			</div>
		</section>
	);
}
