"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useMeetingDetail, useParticipants, useReviews } from "@/features/meetupDetail/queries";
import InformationContainer from "@/features/meetupDetail/components/Containers/InformationContainer";
import PersonnelContainer from "@/features/meetupDetail/components/Containers/PersonnelContainer";
import CommentCards from "@/features/meetupDetail/components/Cards/CommentCards";
import CompactCards from "@/features/meetupDetail/components/Cards/CompactCards";
import { mockRelatedMeetings } from "@/features/meetupDetail/components/Cards/CompactCards/mocks";
import type { CommentProps } from "@/features/meetupDetail/components/Cards/CommentCards";
import KakaoMap from "@/features/meetupDetail/components/KakaoMap";

// TODO: 추후 auth에서 가져올 예정
const CURRENT_USER_ID = 1;

interface MeetupDetailClientProps {
	meetupId: number;
}

export default function MeetupDetailClient({ meetupId }: MeetupDetailClientProps) {
	const { data: meeting } = useMeetingDetail(meetupId);
	const { data: participantsData } = useParticipants(meetupId);
	const { data: reviewsData } = useReviews(meetupId);
	const [pressedMap, setPressedMap] = useState<Record<number, boolean>>({});

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

	if (!meeting) return null;

	const isHost = meeting.hostId === CURRENT_USER_ID;
	const participants = participantsData?.data ?? [];

	const handlePress = (id: number) => {
		setPressedMap((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	return (
		<>
			{/* 섹션 1 - 모임 소개 */}
			<section className="flex flex-col gap-4 md:flex-row md:items-start lg:gap-5">
				<div className="relative aspect-343/241 w-full overflow-hidden rounded-2xl md:h-83 md:w-83 lg:h-110.75 lg:w-157.5 lg:rounded-4xl">
					<Image alt={meeting.name} src={meeting.image} fill className="object-cover" priority />
				</div>
				<div className="flex flex-1 flex-col gap-5">
					<InformationContainer {...meeting} isHost={isHost} />
					<PersonnelContainer
						capacity={meeting.capacity}
						participantCount={meeting.participantCount}
						participants={participants}
					/>
				</div>
			</section>

			{/* 섹션 2 - 모임 설명 */}
			<section className="mt-10 flex h-fit w-85.75 flex-col gap-3 md:w-174 md:gap-4 lg:w-7xl lg:gap-5">
				<span className="pl-1.5 text-base font-semibold md:text-xl lg:pl-2.5 lg:text-2xl">
					모임 설명
				</span>
				<div className="w-full overflow-hidden rounded-3xl bg-white px-5 py-4 md:rounded-4xl md:px-12 md:py-6">
					<span className="text-sm font-normal text-gray-700 md:text-lg">
						{meeting.description}
					</span>
				</div>
			</section>

			{/* 섹션 3 - 지도 API */}
			<section className="mt-10 flex h-fit w-85.75 flex-col gap-3 md:mt-16 md:w-174 md:gap-4 lg:mt-20 lg:w-7xl lg:gap-5">
				<span className="pl-1.5 text-base font-semibold md:text-xl lg:pl-2.5 lg:text-2xl">
					모임 장소
				</span>
				<KakaoMap
					address={meeting.address}
					latitude={meeting.latitude}
					longitude={meeting.longitude}
				/>
			</section>

			{/* 섹션 4 - 리뷰 목록 */}
			<section className="mt-10 md:mt-16 lg:mt-20">
				<CommentCards comments={comments} />
			</section>

			{/* 섹션 5 - 모임 추천 */}
			<section className="mt-17 flex h-fit w-85.75 flex-col gap-3 md:mt-18 md:w-174 md:gap-4 lg:mt-22 lg:w-7xl">
				<div className="pl-1.5 lg:pl-2.5">
					<h3 className="text-base font-semibold md:text-xl lg:text-2xl">이런 모임은 어떠세요?</h3>
				</div>
				<div className="grid grid-cols-2 gap-x-4 gap-y-6 md:flex md:gap-6 md:overflow-x-auto md:pb-4 lg:gap-8">
					{mockRelatedMeetings.map((meet) => (
						<div key={meet.id} className="shrink-0">
							<CompactCards
								{...meet}
								isPressed={pressedMap[meet.id] ?? false}
								onPress={() => handlePress(meet.id)}
							/>
						</div>
					))}
				</div>
			</section>
		</>
	);
}
