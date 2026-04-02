"use client";

import { Suspense, useMemo } from "react";
import Image from "next/image";
import {
	useMeetingDetail,
	useParticipants,
	useRelatedMeetings,
	useReviews,
} from "@/features/meetupDetail/queries";
import InformationContainer from "@/features/meetupDetail/components/InformationContainer";
import PersonnelContainer from "@/features/meetupDetail/components/PersonnelContainer";
import CommentCards from "@/features/meetupDetail/components/CommentCards";
import CompactCards from "@/features/meetupDetail/components/CompactCards";
import type { CommentProps } from "@/features/meetupDetail/components/CommentCards";
import KakaoMap from "@/features/meetupDetail/components/KakaoMap";
import useDragScroll, { containerStyle } from "@/hooks/useDragScroll";
import { toMeetupEditData } from "@/features/meetupDetail/edit/utils";
import { useCursorPagination } from "@/hooks/useCursorPagination";
import MeetupIntroSkeleton from "@/features/meetupDetail/components/Skeletons/MeetupIntroSkeleton";
import MeetupDescSkeleton from "@/features/meetupDetail/components/Skeletons/MeetupDescSkeleton";
import MeetupMapSkeleton from "@/features/meetupDetail/components/Skeletons/MeetupMapSkeleton";
import MeetupRelatedSkeleton from "@/features/meetupDetail/components/Skeletons/MeetupRelatedSkeleton";
import MeetupReviewSkeleton from "@/features/meetupDetail/components/Skeletons/MeetupReviewSkeleton";
import SectionErrorFallback from "@/features/meetupDetail/components/SectionErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import Empty from "@/components/layout/Empty";
import { useUserStore } from "@/store/user.store";

interface MeetupDetailClientProps {
	meetupId: number;
}

export default function MeetupDetailClient({ meetupId }: MeetupDetailClientProps) {
	return (
		<>
			{/* 섹션 1 - 모임 소개 */}
			<ErrorBoundary FallbackComponent={SectionErrorFallback}>
				<Suspense fallback={<MeetupIntroSkeleton />}>
					<MeetupIntroSection meetupId={meetupId} />
				</Suspense>
			</ErrorBoundary>
			{/* 섹션 2 - 모임 설명 */}
			<ErrorBoundary FallbackComponent={SectionErrorFallback}>
				<Suspense fallback={<MeetupDescSkeleton />}>
					<MeetupDescSection meetupId={meetupId} />
				</Suspense>
			</ErrorBoundary>
			{/* 섹션 3 - 지도 */}
			<ErrorBoundary FallbackComponent={SectionErrorFallback}>
				<Suspense fallback={<MeetupMapSkeleton />}>
					<MeetupMapSection meetupId={meetupId} />
				</Suspense>
			</ErrorBoundary>
			{/* 섹션 4 - 리뷰 목록 */}
			<ErrorBoundary FallbackComponent={SectionErrorFallback}>
				<Suspense fallback={<MeetupReviewSkeleton />}>
					<MeetupReviewSection meetupId={meetupId} />
				</Suspense>
			</ErrorBoundary>
			{/* 섹션 5 - 관련 모임 */}
			<ErrorBoundary FallbackComponent={SectionErrorFallback}>
				<Suspense fallback={<MeetupRelatedSkeleton />}>
					<MeetupRelatedSection meetupId={meetupId} />
				</Suspense>
			</ErrorBoundary>
		</>
	);
}

function MeetupIntroSection({ meetupId }: { meetupId: number }) {
	const { data: meeting } = useMeetingDetail(meetupId);
	const { data: participantsData } = useParticipants(meetupId);
	const { user, isPending: isMePending } = useUserStore();

	const isHost = !isMePending && meeting.hostId === user?.id;
	const editInitialData = toMeetupEditData(meeting);
	const participants = participantsData?.data ?? [];

	return (
		<section className="flex w-full flex-col gap-4 md:flex-row lg:gap-5">
			<div className="relative aspect-343/241 w-full overflow-hidden rounded-2xl md:aspect-auto md:w-1/2 md:self-stretch lg:rounded-4xl">
				<Image alt={meeting.name} src={meeting.image} fill className="object-cover" priority />
			</div>
			<div className="flex w-full flex-col gap-5 md:w-1/2">
				<InformationContainer {...meeting} isHost={isHost} editInitialData={editInitialData} />
				<PersonnelContainer
					capacity={meeting.capacity}
					participantCount={meeting.participantCount}
					participants={participants}
					confirmedAt={meeting.confirmedAt}
				/>
			</div>
		</section>
	);
}

function MeetupDescSection({ meetupId }: { meetupId: number }) {
	const { data: meeting } = useMeetingDetail(meetupId);

	return (
		<section className="mt-10 flex h-fit w-full flex-col gap-3 md:gap-4 lg:gap-5">
			<span className="pl-1.5 text-base font-semibold md:text-xl lg:pl-2.5 lg:text-2xl">
				모임 설명
			</span>
			<div className="w-full overflow-hidden rounded-3xl bg-white px-5 py-4 md:rounded-4xl md:px-12 md:py-6">
				<span className="text-sm font-normal text-gray-700 md:text-lg">{meeting.description}</span>
			</div>
		</section>
	);
}

function MeetupMapSection({ meetupId }: { meetupId: number }) {
	const { data: meeting } = useMeetingDetail(meetupId);

	return (
		<section className="mt-10 flex h-fit w-full flex-col gap-3 md:mt-16 md:gap-4 lg:mt-20 lg:gap-5">
			<span className="pl-1.5 text-base font-semibold md:text-xl lg:pl-2.5 lg:text-2xl">
				모임 장소
			</span>
			<KakaoMap
				address={meeting.address}
				latitude={meeting.latitude}
				longitude={meeting.longitude}
			/>
		</section>
	);
}

function MeetupReviewSection({ meetupId }: { meetupId: number }) {
	const { currentPage, currentCursor, handlePageChange } = useCursorPagination();
	const { data: reviewsData } = useReviews(meetupId, currentCursor);
	const hasMoreReviews = reviewsData.hasMore;

	const comments = useMemo<CommentProps[]>(
		() =>
			(reviewsData?.data ?? []).map((review) => ({
				id: review.id,
				score: review.score,
				comment: review.comment,
				createdAt: review.createdAt,
				user: review.user,
			})),
		[reviewsData],
	);

	return (
		<section className="mt-10 w-full md:mt-16 lg:mt-20">
			<CommentCards
				meetingId={meetupId}
				comments={comments}
				currentPage={currentPage}
				hasMore={hasMoreReviews}
				onPageChange={(page) => handlePageChange(page, reviewsData?.nextCursor, hasMoreReviews)}
			/>
		</section>
	);
}

function MeetupRelatedSection({ meetupId }: { meetupId: number }) {
	const { data: meeting } = useMeetingDetail(meetupId);
	const { data: relatedData } = useRelatedMeetings(meetupId, meeting.region, meeting.type);

	const relatedMeetings = relatedData?.data ?? [];

	const { ref, style, overlays, ...dragScrollEvents } = useDragScroll<HTMLDivElement>();

	return (
		<section className="mt-17 flex h-fit w-full flex-col gap-3 md:mt-18 md:gap-4 lg:mt-22">
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
		</section>
	);
}
