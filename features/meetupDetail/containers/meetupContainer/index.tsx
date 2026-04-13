"use client";

import { Suspense } from "react";
import MeetupIntroSkeleton from "@/features/meetupDetail/components/Skeletons/MeetupIntroSkeleton";
import MeetupDescSkeleton from "@/features/meetupDetail/components/Skeletons/MeetupDescSkeleton";
import MeetupMapSkeleton from "@/features/meetupDetail/components/Skeletons/MeetupMapSkeleton";
import MeetupRelatedSkeleton from "@/features/meetupDetail/components/Skeletons/MeetupRelatedSkeleton";
import MeetupReviewSkeleton from "@/features/meetupDetail/components/Skeletons/MeetupReviewSkeleton";
import SectionErrorFallback from "@/features/meetupDetail/components/SectionErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import MeetupRelatedSection from "@/features/meetupDetail/containers/meetupContainer/MeetupRelatedSection";
import MeetupReviewSection from "@/features/meetupDetail/containers/meetupContainer/MeetupReviewSection";
import MeetupMapSection from "@/features/meetupDetail/containers/meetupContainer/MeetupMapSection";
import MeetupDescSection from "@/features/meetupDetail/containers/meetupContainer/MeetupDescSection";
import MeetupIntroSection from "@/features/meetupDetail/containers/meetupContainer/MeetupIntroSection";

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
