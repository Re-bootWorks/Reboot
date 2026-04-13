"use client";

import { useMemo, useRef, useState } from "react";
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

	const sectionHeight = useMemo(() => {
		const stepCount = HOW_IT_WORKS_STEPS.length;
		return `${stepCount * 100}svh`;
	}, []);

	return (
		<section ref={sectionRef} className="relative bg-gray-50" style={{ height: sectionHeight }}>
			<div className="sticky top-0 flex min-h-svh items-center overflow-hidden lg:h-svh">
				<SectionContainer className="w-full px-6 pt-12.5 pb-17 md:px-12 md:py-20 lg:flex lg:h-svh lg:items-center lg:py-0">
					<div className="w-full">
						<SectionHeader
							title="충전은 이렇게 시작됩니다"
							description="RE:BOOT와 함께하는 5단계 여정"
						/>

						<div className="mt-10 lg:mt-14">
							<StepCard steps={HOW_IT_WORKS_STEPS} activeIndex={activeIndex} />
						</div>
					</div>
				</SectionContainer>
			</div>
		</section>
	);
}
