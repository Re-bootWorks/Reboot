"use client";

import MotionFadeUp from "../../Motions/MotionFadeUp";
import { MotionItem } from "../../Motions/MotionItem";
import MotionStagger from "../../Motions/MotionStagger";
import SectionContainer from "../../SectionLayout/SectionContainer";
import SectionHeader from "../../SectionLayout/SectionHeader";
import { CATEGORIES } from "../data";
import CategoryCard from "./CategoryCard";

export default function CategoriesSection() {
	return (
		<section className="relative overflow-hidden bg-white py-12.5 md:pt-20 md:pb-32.5 lg:pt-37.5 lg:pb-57.5">
			<div className="absolute top-[-45px] left-[-45px] h-80 w-80 rounded-full bg-purple-100 opacity-70 blur-[100px]" />
			<div className="absolute top-[820px] right-[0px] h-80 w-80 rounded-full bg-purple-100 opacity-70 blur-[100px] lg:top-[600px] lg:right-[-100px]" />

			<SectionContainer className="relative z-5">
				<MotionFadeUp>
					<SectionHeader
						title="어떤 에너지를 찾고 계신가요?"
						description="다양한 카테고리에서 당신의 모임을 찾아보세요"
					/>
				</MotionFadeUp>

				<MotionStagger className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3">
					{CATEGORIES.map((category) => (
						<MotionItem key={category.title}>
							<CategoryCard {...category} />
						</MotionItem>
					))}
				</MotionStagger>
			</SectionContainer>
		</section>
	);
}
