"use client";

import { useRef } from "react";
import InputFile, { type InputFileHandle } from "@/components/ui/Inputs/InputFile";
import { useToast } from "@/providers/toast-provider";
import type { UploadImageFn } from "@/apis/images";

interface FileFieldProps {
	/** 기본 이미지 */
	defaultUrl?: string;
	/** 이미지 값 변경 함수 */
	onChange: (image: string, e: React.ChangeEvent<HTMLInputElement>) => void;
	/** 이미지 업로드 함수 */
	uploadImageFn: UploadImageFn;
	/** 필드명 @default "imageUrl" */
	name?: string;
	/** 필수 필드 여부 @default true */
	isRequired?: boolean;
}
export default function FileField({
	defaultUrl,
	name = "imageUrl",
	onChange,
	uploadImageFn,
	isRequired = true,
}: FileFieldProps) {
	const { handleShowToast } = useToast();
	const inputFileRef = useRef<InputFileHandle>(null);

	async function handleUploadImage(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const res = await uploadImageFn(file);
			if (typeof res === "string") {
				onChange(res, e);
			} else {
				handleShowToast({ message: res.message, status: "error" });
			}
		} catch (error) {
			let message: string;
			if (error instanceof Error) {
				message = error.message;
			} else {
				message = "이미지 업로드 중 오류가 발생했습니다.";
			}
			handleShowToast({ message, status: "error" });
			inputFileRef.current?.reset();
		}
	}

	return (
		<InputFile
			ref={inputFileRef}
			defaultUrl={defaultUrl}
			label="이미지"
			name={name}
			isRequired={isRequired}
			onChange={handleUploadImage}
		/>
	);
}
