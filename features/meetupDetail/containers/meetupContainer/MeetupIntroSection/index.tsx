import { useMeetingDetail } from "@/features/meetupDetail/queries";
import { useUserStore } from "@/store/user.store";
import { toMeetupEditData } from "@/features/meetupDetail/edit/utils";
import Image from "next/image";
import InformationContainer from "@/features/meetupDetail/components/InformationContainer";
import PersonnelContainer from "@/features/meetupDetail/components/PersonnelContainer";
import { slideFromLeftVariants, slideFromRightVariants } from "@/features/meetupDetail/animations";
import { motion } from "motion/react";

export default function MeetupIntroSection({ meetupId }: { meetupId: number }) {
	const { data: meeting } = useMeetingDetail(meetupId);
	const { user, isPending: isMePending } = useUserStore();

	const isHost = !isMePending && meeting.hostId === user?.id;
	const editInitialData = toMeetupEditData(meeting);

	return (
		<section className="flex w-full flex-col gap-4 md:flex-row lg:gap-5">
			<motion.div
				variants={slideFromLeftVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.1 }}
				className="relative aspect-343/241 w-full overflow-hidden rounded-2xl md:aspect-auto md:w-1/2 md:self-stretch lg:rounded-4xl">
				<Image alt={meeting.name} src={meeting.image} fill className="object-cover" priority />
			</motion.div>
			<motion.div
				variants={slideFromRightVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, amount: 0.1 }}
				className="flex w-full flex-col gap-5 md:w-1/2">
				<InformationContainer {...meeting} isHost={isHost} editInitialData={editInitialData} />
				<PersonnelContainer
					meetingId={meetupId}
					capacity={meeting.capacity}
					participantCount={meeting.participantCount}
					confirmedAt={meeting.confirmedAt}
					hostId={meeting.hostId}
				/>
			</motion.div>
		</section>
	);
}
