import Alert from "@/components/ui/Modals/AlertModal";

interface CancelJoinModalProps {
	isOpen: boolean;
	isPending: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export default function CancelJoinModal({
	isOpen,
	isPending,
	onClose,
	onConfirm,
}: CancelJoinModalProps) {
	return (
		<Alert
			isOpen={isOpen}
			onClose={onClose}
			confirmLabel="참여 취소하기"
			isPending={isPending}
			handleConfirmButton={onConfirm}>
			<p>모임 참여를 취소하시겠어요?</p>
			<p className="mt-1 text-sm font-normal text-gray-500 md:text-base">
				취소 후 재참여 할 수 있으나, 인원이 찰 경우 참여가 어려울 수 있습니다.
			</p>
		</Alert>
	);
}
