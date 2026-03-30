"use client";
import { Suspense, useRef, useState } from "react";
import DetailCard from "../components/DetailCard";
import { DetailCardBadge } from "@/features/mypage/types";
import { CreatedItem } from "@/features/mypage/types";
import AlertModal from "@/components/ui/Modals/AlertModal";
import useMeetingFavorite from "@/hooks/useMeetingFavorite";
import Empty from "@/components/layout/Empty";
import { useMyCreatedInfinite } from "../queries";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Loading from "@/components/ui/Loading";
import DetailCardSkeleton from "../components/DetailCard/DetailCardSkeleton";
import { useDeleteMeeting } from "../mutations";

// 모임 배지 상태
function meetupBadges(item: CreatedItem): DetailCardBadge[] {
	if (item.canceledAt) {
		return [{ label: "개설 취소", variant: "completedAlt" }];
	}
	if (item.isCompleted) {
		return [{ label: "이용 완료", variant: "completed" }];
	}
	if (item.confirmedAt) {
		return [{ label: "개설확정", variant: "confirmed", showStatusLabel: true }];
	}

	return [{ label: "개설 대기", variant: "pending" }];
}

function Created() {
	const { handleWishToggle } = useMeetingFavorite();
	// 어떤 모임에 대해 alert을 띄웠는지 타겟팅
	const [alertTarget, setAlertTarget] = useState<CreatedItem | null>(null);

	const {
		data: meetupData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useMyCreatedInfinite();
	const items = meetupData.pages.flatMap((page) => page.data) ?? [];
	const observerRef = useRef<HTMLDivElement>(null);
	useIntersectionObserver({
		targetRef: observerRef,
		onIntersect: fetchNextPage,
		isEnabled: !!hasNextPage && !isFetchingNextPage,
	});

	// 모임 삭제하기
	const { mutate: deleteMeeting, isPending: isDeletePending } = useDeleteMeeting();
	// 모임 삭제 시
	function handleAlertConfirm() {
		if (!alertTarget) return;
		deleteMeeting({ meetingId: alertTarget.id }, { onSuccess: closeAlert, onError: closeAlert });
	}

	// alert modal 닫기
	function closeAlert() {
		setAlertTarget(null);
	}

	if (items.length === 0) return <Empty>아직 내가 만든 모임이 없어요</Empty>;

	return (
		<>
			<ul className="mt-6 flex flex-col gap-4 lg:mt-8 lg:gap-6">
				{items.map((item) => {
					return (
						<DetailCard
							key={item.id}
							item={item}
							badges={meetupBadges(item)}
							actions={[
								{
									label: "모임 삭제하기",
									variant: "grayBorder",
									handleCardButtonClick: () => setAlertTarget(item),
									isDestructive: true,
								},
							]}
							wishAction={{
								isWished: item.isFavorited,
								isPending: false,
								handleWishClick: () => handleWishToggle(item.id, item.isFavorited),
							}}
						/>
					);
				})}
			</ul>

			<div ref={observerRef} className="h-4" />
			{isFetchingNextPage && <Loading />}

			<AlertModal
				isOpen={!!alertTarget}
				isPending={isDeletePending}
				onClose={closeAlert}
				handleConfirmButton={handleAlertConfirm}>
				모임을 삭제하시겠습니까?
			</AlertModal>
		</>
	);
}

export default function CreatedWrapper() {
	return (
		<Suspense fallback={<DetailCardSkeleton />}>
			<Created />
		</Suspense>
	);
}
