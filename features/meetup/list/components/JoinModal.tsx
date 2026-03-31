"use client";

import Image from "next/image";
import Link from "next/link";
import type { MeetupItemSelected } from "../types";
import { useDeleteMeetupJoin, usePostMeetupJoin } from "../../queries";
import { useMeetupToggle } from "../hooks";
import { modalSizeStyle } from "../../styles";
import Button from "@/components/ui/Buttons/Button";
import { Modal } from "@/components/ui/Modals";
import { IcCalendarOutline, IcChevronRight, IcDotPoints, IcLocation } from "@/components/ui/icons";

interface JoinModalProps {
	isOpen: boolean;
	selectedData: MeetupItemSelected | null;
	onClose: () => void;
}
export default function JoinModal({ isOpen, selectedData, onClose }: JoinModalProps) {
	const id = selectedData?.id as number;
	const { onMutate, onSuccess, onError } = useMeetupToggle(id, "isJoined");
	const postJoinMutation = usePostMeetupJoin(id, {
		onMutate,
		onSuccess: () => {
			onSuccess("모임에 참여되었습니다.");
			onClose();
		},
		onError,
	});
	const deleteJoinMutation = useDeleteMeetupJoin(id, {
		onMutate,
		onSuccess: () => {
			onSuccess("모임 참여가 취소되었습니다.");
			onClose();
		},
		onError,
	});

	function handleClickJoinButton() {
		if (selectedData?.isJoined) {
			deleteJoinMutation.mutate();
		} else {
			postJoinMutation.mutate();
		}
	}

	if (!selectedData) return null;
	return (
		<Modal
			title={selectedData?.name}
			isOpen={isOpen && !!selectedData}
			onClose={onClose}
			className={modalSizeStyle}>
			{/* 이미지 + 정보 통합 카드 */}
			<div className="overflow-hidden rounded-xl bg-gray-50">
				<div className="relative aspect-video w-full">
					<Image src={selectedData?.image} alt={selectedData?.name} fill className="object-cover" />
				</div>
				<div className="flex flex-col gap-1 px-4 py-3.5 text-sm text-gray-700 md:text-base">
					<div className={detailStyles}>
						<IcDotPoints {...iconProps} />
						<span>{selectedData?.type}</span>
					</div>
					<div className={detailStyles}>
						<IcLocation {...iconProps} />
						<span>{selectedData?.address}</span>
					</div>
					<div className={detailStyles}>
						<IcCalendarOutline {...iconProps} />
						<span>
							{selectedData?.date} · {selectedData?.time}
						</span>
					</div>
				</div>
			</div>

			<div className="mt-2 text-right">
				<Link
					className="inline-flex items-center text-sm text-purple-500 md:text-base"
					href={`/meetup/${selectedData?.id}`}>
					상세 보기
					<IcChevronRight {...iconProps} />
				</Link>
			</div>

			<p className="my-2 text-center text-sm text-gray-600">
				{!selectedData?.isJoined ? "이 모임에 참여하시겠어요?" : "이 모임 참여를 취소하시겠어요?"}
			</p>

			<Button
				onClick={handleClickJoinButton}
				isPending={postJoinMutation.isPending || deleteJoinMutation.isPending}>
				{selectedData?.isJoined ? "참여 취소" : "참여하기"}
			</Button>
		</Modal>
	);
}

const detailStyles = "flex items-center gap-1.5";
const iconProps = {
	className: "size-3.5 shrink-0",
	color: "currentColor",
};
