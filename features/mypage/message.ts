const RETRY_LATER_SUFFIX = "\n잠시 후 다시 시도해주세요.";

export const MYPAGE_MESSAGES = {
	fetchListError: "목록 조회에 실패했습니다." + RETRY_LATER_SUFFIX,
	patchMeetingStatusSuccess: (status: "CONFIRMED" | "CANCELED") =>
		`모임이 ${status === "CONFIRMED" ? "확정" : "취소"}되었습니다.`,
	patchMeetingStatusError: "모임 상태 변경에 실패했습니다." + RETRY_LATER_SUFFIX,
	deleteMeetingSuccess: "모임이 삭제 되었습니다.",
	deleteMeetingError: "모임 삭제에 실패했습니다." + RETRY_LATER_SUFFIX,
	deleteMeetingNotFoundError: "이미 삭제된 모임입니다.",
	deleteMeetingJoinSuccess: "모임 예약이 취소 되었습니다.",
	deleteMeetingJoinError: "모임 참여 취소에 실패했습니다." + RETRY_LATER_SUFFIX,
	createReviewSuccess: "리뷰가 작성 되었습니다.",
	createReviewError: "리뷰 작성에 실패했습니다." + RETRY_LATER_SUFFIX,
	updateReviewSuccess: "리뷰가 수정 되었습니다.",
	updateReviewError: "리뷰 수정에 실패했습니다." + RETRY_LATER_SUFFIX,
	deleteReviewSuccess: "리뷰가 삭제 되었습니다.",
	deleteReviewError: "리뷰 삭제에 실패했습니다." + RETRY_LATER_SUFFIX,
	updateProfileSuccess: "프로필이 수정되었습니다.",
	updateProfileError: "프로필 수정에 실패했습니다." + RETRY_LATER_SUFFIX,
	uploadProfileImageSuccess: "이미지가 업로드되었습니다.",
	uploadProfileImageError: "이미지 업로드에 실패했습니다." + RETRY_LATER_SUFFIX,
};
