"use client";

import { useEffect, useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import Button from "@/components/ui/Buttons/Button";
import InputField from "@/components/ui/Inputs/InputField";
import { Modal } from "@/components/ui/Modals";
import useToggle from "@/hooks/useToggle";
import Alert from "@/components/ui/Modals/AlertModal";
import { useUserStore } from "@/store/user.store";
import ProfileImage from "./ProfileImage";
import { usePatchUsersMe } from "../../mutations";
import { PatchUserProfilePayload, UserProfile } from "../../types";

const STYLE = {
	modal: "min-h-100 w-[calc(100%-32px)] max-w-136 p-6 pt-8 md:w-full md:p-12",
	modalButton: "shrink md:h-15 md:rounded-2xl md:text-xl",
};

const profileSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, "닉네임은 필수 입력 항목입니다.")
		.max(8, "닉네임은 8자 이하로 입력해주세요."),
	email: z.email("이메일 형식이 아닙니다."),
	image: z.string().nullable().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileModalProps {
	/** 유저 정보 */
	user: UserProfile;
	/** 모달 열림 여부 */
	isOpen: boolean;
	/** 모달을 닫는 외부 핸들러 */
	onClose: () => void;
}

// 사용자 정보 form 기본값 생성
function getProfileDefaultValues(user: UserProfile): ProfileFormValues {
	return {
		name: user.name,
		email: user.email,
		image: user.image ?? null,
	};
}

// 현재 form 값과 원본 user를 비교해 실제 변경된 필드만 payload로 생성
function buildProfilePayload(data: ProfileFormValues, user: UserProfile): PatchUserProfilePayload {
	const payload: PatchUserProfilePayload = {};

	if (data.name !== undefined && data.name !== user.name) {
		payload.name = data.name;
	}

	if (data.email !== undefined && data.email !== user.email) {
		payload.email = data.email;
	}

	if (data.image !== null && data.image !== undefined && data.image !== user.image) {
		payload.image = data.image;
	}

	return payload;
}

// 프로필 폼 상태와 저장/취소
export default function ProfileModal({ user, isOpen, onClose }: ProfileModalProps) {
	const { isOpen: alertOpen, open, close } = useToggle();
	const { mutate, isPending } = usePatchUsersMe();
	const queryClient = useQueryClient();
	const setUser = useUserStore((state) => state.setUser);
	const profileFormId = useId();
	const [isImageUploading, setIsImageUploading] = useState(false);

	// RHF으로 이름, 이메일, 이미지 필드 관리
	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors, isDirty },
	} = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: getProfileDefaultValues(user),
	});

	// 모달이 열릴 때마다 현재 유저 정보로 폼 값을 초기화
	useEffect(() => {
		if (!isOpen) return;

		reset(getProfileDefaultValues(user));
	}, [user, isOpen, reset]);

	// 수정 중 취소 시 Alert
	function handleEditCancel() {
		if (isDirty) {
			open(); // 확인 알림창 열기
		} else {
			onClose(); // 내용이 없으면 바로 닫기
		}
	}

	// 모달 닫기
	function handleModalClose() {
		close();
		onClose();
	}

	// 제출 시 form 값과 원본 user를 비교해 바뀐 필드만 mutation payload로 보내고,
	// 성공하면 최신 user를 store에 반영한 뒤 모달을 닫는다.
	const handleProfileSubmit = handleSubmit(async (profileFormValues) => {
		const payload = buildProfilePayload(profileFormValues, user);

		if (Object.keys(payload).length === 0) {
			handleModalClose();
			return;
		}

		mutate(payload, {
			onSuccess: (updatedUser) => {
				handleModalClose();
				setUser(updatedUser);
				queryClient.invalidateQueries({ queryKey: ["me"] });
			},
		});
	});

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={handleEditCancel}
				title="프로필 수정하기"
				className={STYLE.modal}
				footer={
					<div className="flex gap-3">
						<Button
							type="button"
							colors="grayBorder"
							sizes="medium"
							onClick={handleEditCancel}
							className={STYLE.modalButton}>
							취소
						</Button>
						<Button
							type="submit"
							form={profileFormId}
							colors="purple"
							sizes="medium"
							isPending={isPending || isImageUploading}
							className={STYLE.modalButton}>
							수정하기
						</Button>
					</div>
				}>
				<form
					id={profileFormId}
					onSubmit={handleProfileSubmit}
					className="flex flex-col gap-4 md:gap-6">
					<Controller
						control={control}
						name="image"
						render={({ field }) => (
							<ProfileImage
								isOpen={isOpen}
								initialImageUrl={user.image}
								value={field.value ?? null}
								handleImageChange={field.onChange}
								handleUploadPendingChange={setIsImageUploading}
							/>
						)}
					/>

					<InputField
						label="닉네임"
						isRequired={true}
						placeholder="닉네임을 입력해주세요"
						{...register("name")}
						hintText={errors.name?.message}
						isDestructive={!!errors.name}
						className="mt-4 md:mt-6"
					/>
					<InputField
						label="아이디"
						isRequired={true}
						placeholder="이메일을 입력해주세요"
						{...register("email")}
						hintText={errors.email?.message}
						isDestructive={!!errors.email}
					/>
				</form>
			</Modal>

			{/* dirty 상태에서 닫으려 할 때 취소 확인용 Alert 노출 */}
			<Alert isOpen={alertOpen} onClose={close} handleConfirmButton={handleModalClose}>
				변경된 내용이 있습니다.
				<br />
				수정을 취소하시겠습니까?
			</Alert>
		</>
	);
}
