"use client";

import { Modal } from "@/components/ui/Modals";
import Avatar from "@/components/ui/Avatar";

/**
 * 유저 프로필 모달
 *
 * 유저 이름, 프로필 이미지, 이메일을 보여주는 모달입니다.
 *
 * @example
 * <UserProfileModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   authorName="홍길동"
 *   authorImage="/profile.png"
 *   email="hong@example.com"
 * />
 */

interface UserProfileModalProps {
	/** 모달 열림 여부 */
	isOpen: boolean;
	/** 모달 닫기 핸들러 */
	onClose: () => void;
	/** 유저 이름 */
	authorName: string;
	/** 프로필 이미지 URL - 없으면 기본 이미지 표시 */
	authorImage?: string;
	/** 이메일 - 없으면 표시 안 함 */
	email?: string;
}

export default function UserProfileModal({
	isOpen,
	onClose,
	authorName,
	authorImage,
	email,
}: UserProfileModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			isCenterTitle
			hideCloseButton={false}
			className="max-w-[21rem]">
			<div className="flex flex-col items-center gap-4">
				{/* 프로필 이미지 */}
				<Avatar src={authorImage ?? null} width={100} height={100} alt={authorName} />

				{/* 이름 */}
				<span className="text-lg font-semibold text-gray-900">{authorName}</span>

				{/* 이메일 */}
				{email && (
					<span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-600">
						{email}
					</span>
				)}
			</div>
		</Modal>
	);
}
