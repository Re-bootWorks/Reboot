import type { Metadata } from "next";
import CategoriesSection from "@/features/landing/components/Sections/CategoriesSection";
import FinalCtaSection from "@/features/landing/components/Sections/FinalCtaSection";
import HeroSection from "@/features/landing/components/Sections/HeroSection";
import HowItWorksSection from "@/features/landing/components/Sections/HowItWorksSection";
import ProblemSection from "@/features/landing/components/Sections/ProblemSection";
import SolutionSection from "@/features/landing/components/Sections/SolutionSection";
import TestimonialsSection from "@/features/landing/components/Sections/TestimonialsSection";

export const metadata: Metadata = {
	title: "모임 플랫폼 | RE:BOOT",
	description:
		"관심사 기반으로 모임을 탐색하고, 찜하기·참여 신청·리뷰 확인까지 한 흐름으로 이어지는 모임 플랫폼 RE:BOOT",
};

export default function Home() {
	return (
		<main>
			<HeroSection />
			<ProblemSection />
			<SolutionSection />
			<CategoriesSection />
			<HowItWorksSection />
			<TestimonialsSection />
			<FinalCtaSection />
		</main>
	);
}
