import { useMeetingDetail } from "@/features/meetupDetail/queries";
import KakaoMap from "@/features/meetupDetail/components/KakaoMap";
import { sectionVariants } from "@/features/meetupDetail/animations";
import { motion } from "motion/react";

export default function MeetupMapSection({ meetupId }: { meetupId: number }) {
	const { data: meeting } = useMeetingDetail(meetupId);

	return (
		<motion.section
			variants={sectionVariants}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.1 }}
			className="flex h-fit w-full flex-col gap-3 md:gap-4 lg:gap-5">
			<span className="pl-1.5 text-base font-semibold md:text-xl lg:pl-2.5 lg:text-2xl">
				모임 장소
			</span>
			<KakaoMap
				address={meeting.address}
				latitude={meeting.latitude}
				longitude={meeting.longitude}
			/>
		</motion.section>
	);
}
