"use client";

import { Dispatch, SetStateAction } from "react";
import { DetailCardItem } from "../components/DetailCard/type";

export default function useMeetingFavorite<T extends DetailCardItem>(
	setItems: Dispatch<SetStateAction<T[]>>,
) {
	// @TODO 추후 api 추가
	// 찜 낙관적 업데이트
	function handleWishToggle(meetingId: number) {
		// 클릭한 항목만 갱신
		setItems((currentItems) =>
			currentItems.map((currentItem) =>
				currentItem.id === meetingId
					? { ...currentItem, isFavorited: !currentItem.isFavorited }
					: currentItem,
			),
		);
	}

	return {
		handleWishToggle,
	};
}
