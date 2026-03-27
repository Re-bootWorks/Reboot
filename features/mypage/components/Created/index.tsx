"use client";
import { useState } from "react";
import DetailCard from "../DetailCard";
import { DetailCardBadge } from "@/features/mypage/types";
import { CreatedItem, CreatedList } from "@/features/mypage/types";
import { mockMyCreated } from "../../mockData";
import AlertModal from "@/components/ui/Modals/AlertModal";
import useMeetingFavorite from "@/features/mypage/hooks/useMeetingFavorite";

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

export default function Created() {
	const initialItems: CreatedList = mockMyCreated;

	const [items, setItems] = useState(initialItems); // 모임 삭제 시 아이템 업데이트
	const { handleWishToggle } = useMeetingFavorite(setItems);
	// 어떤 모임에 대해 alert을 띄웠는지 타겟팅
	const [alertTarget, setAlertTarget] = useState<CreatedItem | null>(null);

	// 모임 삭제 시
	async function handleAlertConfirm() {
		if (!alertTarget) return;
		console.log("모임 삭제 API", alertTarget.id);
	}

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
								handleWishClick: () => handleWishToggle(item.id),
							}}
						/>
					);
				})}
			</ul>
			<AlertModal
				isOpen={!!alertTarget}
				onClose={() => setAlertTarget(null)}
				handleConfirmButton={handleAlertConfirm}>
				모임을 삭제하시겠습니까?
			</AlertModal>
		</>
	);
}
