"use client";

import { useEffect, useId, useRef, useState } from "react";
import DeleteButton from "@/components/ui/Buttons/DeleteButton";
import { IcEditOutline } from "@/components/ui/icons";
import { cn } from "@/utils/cn";
import useInputImage from "@/hooks/useInputImage";
import z from "zod";
import { useUploadProfileImage } from "../../mutations";
import Avatar from "@/components/ui/Avatar";

const ACCEPTED_IMAGE_TYPES: string[] = ["image/png", "image/jpeg", "image/gif", "image/webp"];
const FILE_ACCEPT = ACCEPTED_IMAGE_TYPES.join(", ");

const STYLE = {
	profileImage: "size-28",
	profileImageEdit: "flex items-center justify-center rounded-full border border-gray-200 bg-white",
	profileButton: "absolute right-0 bottom-0 size-10 cursor-pointer",
	inputHint: "mt-3 px-1 text-xs font-medium text-gray-500 md:text-sm",
};

interface ProfileImageProps {
	initialImageUrl: string | null;
	value: string | null;
	isOpen: boolean;
	handleImageChange: (imageUrl: string | null) => void;
	handleUploadPendingChange?: (isPending: boolean) => void; // 이미지 업로드 시 수정하기 비활성화
}

type ValidationResult = { success: true } | { success: false; error: string };

const imageFileSchema = z.object({
	file: z
		.instanceof(File)
		.refine(
			(file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
			"JPEG, PNG, WebP, GIF 형식의 이미지만 업로드 가능합니다.",
		)
		.refine((file) => file.size <= 1024 * 1024, "파일 크기는 1MB를 초과할 수 없습니다."),
});

// 파일 유효성 검사
function validateImageFile(file: File): ValidationResult {
	const result = imageFileSchema.safeParse({ file });
	if (result.success) {
		return { success: true };
	}
	return {
		success: false,
		error: result.error.issues[0]?.message ?? "이미지 업로드에 실패했습니다.",
	};
}

// 프로필 이미지의 파일 선택, 미리보기, 업로드, 삭제 담당
export default function ProfileImage({
	initialImageUrl,
	value,
	isOpen,
	handleImageChange,
	handleUploadPendingChange,
}: ProfileImageProps) {
	const inputId = useId();
	const inputRef = useRef<HTMLInputElement>(null);
	const { previewUrl, resetFile, changeFile } = useInputImage({
		inputRef,
		defaultUrl: initialImageUrl,
	});
	const [error, setError] = useState<string | null>(null);
	// handler 내부에서 trycatch 사용을 위해  mutateAsync 사용
	const { mutateAsync: uploadImage, isPending } = useUploadProfileImage();

	useEffect(() => {
		handleUploadPendingChange?.(isPending);
	}, [isPending, handleUploadPendingChange]);

	// 모달이 다시 열리면 초기화
	useEffect(() => {
		if (!isOpen) return;

		resetFile();
		setError(null);
		if (inputRef.current) {
			inputRef.current.value = "";
		}
	}, [isOpen]);

	// 미리보기 이미지가 없으면 현재 폼 값, 이미지 등록 안했을 때 기본 이미지
	const displayImage = previewUrl ?? value;

	// 원본과 다른 상태일 때 삭제 버튼 노출
	const showDeleteButton = !!previewUrl || value !== initialImageUrl;

	// 원래 이미지 상태로 복구
	function handleImageReset(errorMessage: string | null = null) {
		setError(errorMessage);
		resetFile();
		handleImageChange(initialImageUrl ?? null);

		if (inputRef.current) {
			inputRef.current.value = "";
		}
	}

	// 파일 선택 시 유효성 검사 후 presigned 업로드 진행
	async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		// 유효성 검사
		const validation = validateImageFile(file);
		if (!validation.success) {
			handleImageReset(validation.error);
			return;
		}
		// 검사 통과시 preview
		await changeFile(e);
		setError(null);

		try {
			const uploadedImageUrl = await uploadImage(file);
			// 업로드가 완료되면 form image 값을 public URL로 교체
			handleImageChange(uploadedImageUrl);
		} catch {
			handleImageReset();
		} finally {
			e.target.value = "";
		}
	}

	return (
		<div className="flex flex-col items-center">
			<div className="relative w-fit">
				<Avatar src={displayImage} width={114} height={114} className={STYLE.profileImage} />

				<label
					htmlFor={inputId}
					className={cn(STYLE.profileImageEdit, STYLE.profileButton)}
					aria-label="프로필 이미지 변경">
					<IcEditOutline color="gray-500" className="cursor-pointer" />
				</label>

				<input
					ref={inputRef}
					id={inputId}
					type="file"
					accept={FILE_ACCEPT}
					className="hidden"
					onChange={handleFileSelect}
				/>

				{showDeleteButton && (
					<DeleteButton
						type="button"
						iconSize="md"
						onClick={() => handleImageReset()}
						className={STYLE.profileButton}
					/>
				)}
			</div>

			<p className={STYLE.inputHint}>
				{isPending ? "업로드 중입니다." : "* 이미지 파일 최대 용량은 1MB 입니다."}
			</p>
			{error && <p className={cn(STYLE.inputHint, "text-error")}>{error}</p>}
		</div>
	);
}
