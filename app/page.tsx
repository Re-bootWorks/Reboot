"use client";

import CategoriesSection from "@/features/landing/components/Sections/CategoriesSection";
import FinalCtaSection from "@/features/landing/components/Sections/FinalCtaSection";
import HeroSection from "@/features/landing/components/Sections/HeroSection";
import HowItWorksSection from "@/features/landing/components/Sections/HowItWorksSection";
import ProblemSection from "@/features/landing/components/Sections/ProblemSection";
import SolutionSection from "@/features/landing/components/Sections/SolutionSection";
import TestimonialsSection from "@/features/landing/components/Sections/TestimonialsSection";

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
