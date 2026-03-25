"use client";
import { useState } from "react";
import DetailCard from "../DetailCard";
import { DetailCardBadge } from "../DetailCard/type";
import { CreatedItem, CreatedList } from "@/features/mypage/type";
import { mockMyCreated } from "../../mockData";
import Alert from "@/components/ui/Modals/AlertModal";
import useMeetingFavorite from "@/features/mypage/hooks/useMeetingFavorite";

// 모임 배지 상태
function meetupBadges(item: CreatedItem): DetailCardBadge[] {
	if (item.canceledAt) {
		return [{ label: "개설 취소", variant: "completedAlt" }];
	}

	return [];
}

export default function Created() {
	const initialItems: CreatedList = mockMyCreated;

	const [items, setItems] = useState(initialItems);
	const { handleWishToggle } = useMeetingFavorite(setItems);
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
			<Alert
				isOpen={!!alertTarget}
				onClose={() => setAlertTarget(null)}
				handleConfirmButton={handleAlertConfirm}>
				모임을 삭제하시겠습니까?
			</Alert>
		</>
	);
}
