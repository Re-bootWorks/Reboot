import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getMeetingDetail, getParticipants, getReviews } from "@/features/meetupDetail/apis";
import { meetupDetailQueryKeys } from "@/features/meetupDetail/queries";
import MeetupDetailClient from "@/features/meetupDetail/containers/meetupContainer";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
	params: Promise<{ meetupId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { meetupId } = await params;
	try {
		const meeting = await getMeetingDetail(Number(meetupId));
		if (!meeting) return { title: "모임을 찾을 수 없습니다." };
		return {
			title: meeting.name,
			description: meeting.description,
		};
	} catch {
		return { title: "에러 발생" };
	}
}

export default async function MeetupDetailPage({ params }: PageProps) {
	const { meetupId } = await params;
	const meetingId = Number(meetupId);

	if (isNaN(meetingId)) notFound();

	const queryClient = new QueryClient();

	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: meetupDetailQueryKeys.meeting(meetingId),
			queryFn: () => getMeetingDetail(meetingId),
			staleTime: 1000 * 60 * 5,
		}),
		queryClient.prefetchQuery({
			queryKey: meetupDetailQueryKeys.participants(meetingId),
			queryFn: () => getParticipants(meetingId),
			staleTime: 1000 * 60 * 3,
		}),
		queryClient.prefetchQuery({
			queryKey: meetupDetailQueryKeys.reviews(meetingId),
			queryFn: () => getReviews(meetingId),
			staleTime: 1000 * 60 * 10,
		}),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<MeetupDetailClient meetupId={meetingId} />
		</HydrationBoundary>
	);
}
