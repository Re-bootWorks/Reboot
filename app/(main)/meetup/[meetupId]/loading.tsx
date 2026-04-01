import MeetupIntroSkeleton from "@/features/meetupDetail/components/Skeletons/MeetupIntroSkeleton";
import MeetupDescSkeleton from "@/features/meetupDetail/components/Skeletons/MeetupDescSkeleton";
import MeetupMapSkeleton from "@/features/meetupDetail/components/Skeletons/MeetupMapSkeleton";
import MeetupReviewSkeleton from "@/features/meetupDetail/components/Skeletons/MeetupReviewSkeleton";
import MeetupRelatedSkeleton from "@/features/meetupDetail/components/Skeletons/MeetupRelatedSkeleton";

export default function MeetupDetailLoading() {
	return (
		<>
			<MeetupIntroSkeleton />
			<MeetupDescSkeleton />
			<MeetupMapSkeleton />
			<MeetupReviewSkeleton />
			<MeetupRelatedSkeleton />
		</>
	);
}
