import { useMeetingDetail, useRelatedMeetings } from "@/features/meetupDetail/queries";
import useDragScroll, { containerStyle } from "@/hooks/useDragScroll";
import Empty from "@/components/ui/Empty";
import CompactCards from "@/features/meetupDetail/components/CompactCards";
import { sectionVariants } from "@/features/meetupDetail/animations";
import { motion } from "motion/react";

export default function MeetupRelatedSection({ meetupId }: { meetupId: number }) {
	const { data: meeting } = useMeetingDetail(meetupId);
	const { data: relatedData } = useRelatedMeetings(meetupId, meeting.region, meeting.type);

	const relatedMeetings = relatedData?.data ?? [];

	const { ref, style, overlays, ...dragScrollEvents } = useDragScroll<HTMLDivElement>();

	return (
		<motion.section
			variants={sectionVariants}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.1 }}
			className="mt-17 flex h-fit w-full flex-col gap-3 md:mt-18 md:gap-4 lg:mt-22">
			<div className="pl-1.5 lg:pl-2.5">
				<h3 className="text-base font-semibold md:text-xl lg:text-2xl">이런 모임은 어떠세요?</h3>
			</div>
			{relatedMeetings.length === 0 ? (
				<Empty section className="w-full">
					추천 모임이 없어요.
				</Empty>
			) : (
				<div className="relative pb-4">
					<div
						ref={ref}
						style={style}
						className={`grid grid-cols-2 gap-4 md:flex md:gap-6 lg:gap-8 ${containerStyle}`}
						{...dragScrollEvents}>
						{relatedMeetings.map((meet) => (
							<div key={meet.id} className="w-full shrink-0 md:w-75.5">
								<CompactCards {...meet} />
							</div>
						))}
					</div>
					{overlays}
				</div>
			)}
		</motion.section>
	);
}
