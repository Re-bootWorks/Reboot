import { useMeetingDetail } from "@/features/meetupDetail/queries";
import { motion } from "motion/react";
import { sectionVariants } from "@/features/meetupDetail/animations";

export default function MeetupDescSection({ meetupId }: { meetupId: number }) {
	const { data: meeting } = useMeetingDetail(meetupId);

	return (
		<motion.section
			variants={sectionVariants}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.1 }}
			className="mt-10 flex h-fit w-full flex-col gap-3 md:gap-4 lg:gap-5">
			<span className="pl-1.5 text-base font-semibold md:text-xl lg:pl-2.5 lg:text-2xl">
				모임 설명
			</span>
			<div className="w-full overflow-hidden rounded-3xl bg-white px-5 py-4 md:rounded-4xl md:px-12 md:py-6">
				<span className="text-sm font-normal whitespace-pre-line text-gray-700 md:text-lg">
					{meeting.description}
				</span>
			</div>
		</motion.section>
	);
}
