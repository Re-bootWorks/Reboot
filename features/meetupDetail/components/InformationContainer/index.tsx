"use client";

import { DeadlineTag } from "@/components/ui/Tags/DeadlineTag";
import { TimeTag } from "@/components/ui/Tags/TimeTag";
import { IcCrownOutline, IcLocation } from "@/components/ui/icons";
import Button from "@/components/ui/Buttons/Button";
import UtilityButton from "@/components/ui/Buttons/UtilityButton";
import ActionDropdown from "@/components/ui/Dropdowns/ActionDropdown";
import { isDeadlinePassed, uiFormatDate, uiFormatDeadline, uiFormatTime } from "@/utils/date";
import useToggle from "@/hooks/useToggle";
import EditMeetup from "@/features/meetupDetail/edit";
import { MeetupEditData } from "@/features/meetupDetail/edit/types";
import Alert from "@/components/ui/Modals/AlertModal";
import {
	useCancelJoinMutation,
	useDeleteMeetingMutation,
	useFavoriteMutation,
	useJoinMutation,
} from "@/features/meetupDetail/mutations";
import { useToast } from "@/providers/toast-provider";
import { useModalStore } from "@/store/modal.store";
import { useUserStore } from "@/store/user.store";
import SendButton from "@/components/ui/Buttons/SendButton";
import { cn } from "@/utils/cn";

interface InformationContainerProps {
	id: number;
	name: string;
	type: string;
	capacity: number;
	region: string;
	dateTime: string;
	registrationEnd: string;
	canceledAt: string | null;
	isHost: boolean;
	isJoined: boolean;
	isFavorited: boolean;
	editInitialData: MeetupEditData;
	participantCount: number;
}

export default function InformationContainer({
	id,
	name,
	type,
	region,
	dateTime,
	registrationEnd,
	capacity,
	canceledAt,
	participantCount,
	isHost,
	isJoined,
	isFavorited,
	editInitialData,
}: InformationContainerProps) {
	const { user, isPending: isMePending } = useUserStore();
	const isLoggedIn = !!user;

	const { openLogin } = useModalStore();
	const { isOpen: isLoginModalOpen, open: openLoginModal, close: closeLoginModal } = useToggle();
	const { isOpen: isEditModalOpen, open: openEditModal, close: closeEditModal } = useToggle();
	const { isOpen: isDeleteModalOpen, open: openDeleteModal, close: closeDeleteModal } = useToggle();

	const { mutate: join, isPending: isJoinPending } = useJoinMutation(id);
	const { mutate: cancelJoin, isPending: isCancelPending } = useCancelJoinMutation(id);
	const { mutate: deleteMeeting, isPending: isDeletePending } = useDeleteMeetingMutation(id);
	const { mutate: toggleFavorite, isPending: isFavoritePending } = useFavoriteMutation(id);

	const { handleShowToast } = useToast();

	const isJoinPendingAny = isJoinPending || isCancelPending;

	const isClosed = isDeadlinePassed(registrationEnd);
	const isRegClosed = isClosed || participantCount >= capacity;

	const handleJoinClick = () => {
		if (isMePending) return;
		if (!isLoggedIn) {
			openLoginModal();
			return;
		}
		if (isJoined) {
			cancelJoin();
		} else {
			if (isRegClosed) return;
			join();
		}
	};

	const handleShareClick = () => {
		navigator.clipboard.writeText(window.location.href);
		handleShowToast({ message: "모임 링크가 복사되었습니다!", status: "success" });
	};

	const handleLoginConfirm = () => {
		closeLoginModal();
		openLogin();
	};

	const handleDeleteConfirm = () => {
		deleteMeeting();
	};

	const handleFavoriteConfirm = () => {
		if (isMePending) return;
		if (!isLoggedIn) {
			openLoginModal();
			return;
		}
		toggleFavorite({ currentState: isFavorited });
	};

	const actionItems = [
		{
			label: "수정하기",
			onClick: openEditModal,
			disabled: !!canceledAt,
		},
		{
			label: "삭제하기",
			onClick: openDeleteModal,
		},
	];

	return (
		<>
			<div className="flex w-full flex-col gap-7 rounded-[20px] bg-white px-6 pt-5 pb-6 lg:gap-10 lg:rounded-4xl lg:px-10 lg:pt-8.5 lg:pb-8">
				<div className="flex w-full flex-col gap-4 lg:gap-6">
					<div className={`flex w-full items-center gap-2 ${isHost ? "justify-between" : ""}`}>
						<div className="flex items-center gap-2">
							{!isRegClosed && (
								<DeadlineTag size="sm" className="md:h-6 md:text-sm">
									{uiFormatDeadline(registrationEnd)}
								</DeadlineTag>
							)}
							<TimeTag size="sm" className="md:h-6 md:text-sm">
								{uiFormatDate(dateTime)}
							</TimeTag>
							<TimeTag size="sm" className="md:h-6 md:text-sm">
								{uiFormatTime(dateTime)}
							</TimeTag>
						</div>
						{isHost && <ActionDropdown items={actionItems} />}
					</div>

					<div className="flex w-full flex-col gap-1 overflow-hidden lg:gap-3">
						<div className="flex items-center gap-1.5 overflow-hidden">
							<h1 className="truncate text-lg lg:text-5xl">{name}</h1>
							{isHost && <IcCrownOutline size="md" className="shrink-0 lg:h-8 lg:w-8" />}
						</div>

						<div className="flex items-center gap-0.5 overflow-hidden text-sm">
							<IcLocation className="h-4 w-4 shrink-0 lg:h-6 lg:w-6" />
							<span>
								{region}·{type}
							</span>
						</div>
					</div>
				</div>

				<div className="flex w-full items-center gap-4">
					{isRegClosed ? (
						<SendButton sizes="small" className="pointer-events-none lg:size-15" />
					) : (
						<UtilityButton
							sizes="small"
							className={cn(
								"transition-colors lg:size-15",
								isFavorited ? "border-purple-500" : "hover:border-purple-500",
							)}
							pressed={isFavorited}
							isPending={isFavoritePending}
							onClick={handleFavoriteConfirm}
						/>
					)}
					<Button
						sizes="small"
						colors={isJoined ? "purpleBorder" : "purple"}
						disabled={!isHost && isRegClosed && !isJoined}
						isPending={!isHost && isJoinPendingAny}
						onClick={isHost ? handleShareClick : handleJoinClick}
						className="flex-1 lg:h-15 lg:rounded-2xl lg:px-7.5 lg:text-xl">
						{isHost ? "공유하기" : isJoined ? "참여 취소하기" : "참여하기"}
					</Button>
				</div>
			</div>

			{/* 로그인 필요 모달 */}
			<Alert
				isOpen={isLoginModalOpen}
				onClose={closeLoginModal}
				confirmLabel="로그인"
				handleConfirmButton={handleLoginConfirm}>
				로그인이 필요한 서비스입니다.
			</Alert>

			{/* 모임 수정 모달 */}
			<EditMeetup
				meetingId={id}
				isOpen={isEditModalOpen}
				onClose={closeEditModal}
				initialData={editInitialData}
				participantCount={participantCount}
			/>

			{/* 모임 삭제 모달 */}
			<Alert
				isOpen={isDeleteModalOpen}
				onClose={closeDeleteModal}
				confirmLabel="삭제하기"
				isPending={isDeletePending}
				handleConfirmButton={handleDeleteConfirm}>
				<p>모임을 정말 삭제하시겠어요?</p>
				<p className="mt-1 text-sm font-normal text-gray-500 md:text-base">
					삭제 후에는 되돌릴 수 없습니다.
				</p>
			</Alert>
		</>
	);
}
