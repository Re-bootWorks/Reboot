import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import {
	getMeetingDetailServer,
	getParticipantsServer,
	getReviewsServer,
} from "@/features/meetupDetail/apis/apis.server";
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
		const meeting = await getMeetingDetailServer(Number(meetupId));
		if (!meeting) return notFound();
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
			queryFn: () => getMeetingDetailServer(meetingId),
			staleTime: 1000 * 60 * 5,
		}),
		queryClient.prefetchQuery({
			queryKey: meetupDetailQueryKeys.participants(meetingId),
			queryFn: () => getParticipantsServer(meetingId),
			staleTime: 1000 * 60 * 3,
		}),
		queryClient.prefetchQuery({
			queryKey: meetupDetailQueryKeys.reviews(meetingId, undefined),
			queryFn: () => getReviewsServer(meetingId),
			staleTime: 1000 * 60 * 10,
		}),
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<MeetupDetailClient meetupId={meetingId} />
		</HydrationBoundary>
	);
}
