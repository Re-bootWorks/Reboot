"use client";

import MotionFadeUp from "../../Motions/MotionFadeUp";
import { MotionItem } from "../../Motions/MotionItem";
import MotionStagger from "../../Motions/MotionStagger";
import SectionContainer from "../../SectionLayout/SectionContainer";
import SectionHeader from "../../SectionLayout/SectionHeader";
import { TESTIMONIALS } from "../data";
import TestimonialCard from "./TestimonialCard";

export default function TestimonialsSection() {
	return (
		<div className="bg-green-50">
			<SectionContainer className="flex flex-col items-center justify-center py-12.5 md:py-20 lg:py-37.5">
				<MotionFadeUp className="mb-12 md:mb-20">
					<SectionHeader
						title="충전된 사람들의 이야기"
						description={
							<>
								함께한 순간이 어떤 특별한 경험이
								<br className="md:hidden" /> 되었는지 전해드립니다.
							</>
						}
					/>
				</MotionFadeUp>

				<MotionStagger className="grid grid-cols-1 gap-12 md:gap-8 lg:grid-cols-6">
					{TESTIMONIALS.map((item, index) => {
						const layoutClassName = [
							"lg:col-span-2",
							"lg:col-span-2",
							"lg:col-span-2",
							"lg:col-span-2 lg:col-start-2",
							"lg:col-span-2 lg:col-start-4",
						][index];

						return (
							<MotionItem key={item.name} className={layoutClassName}>
								<div>
									<TestimonialCard {...item} />
								</div>
							</MotionItem>
						);
					})}
				</MotionStagger>
			</SectionContainer>
		</div>
	);
}
