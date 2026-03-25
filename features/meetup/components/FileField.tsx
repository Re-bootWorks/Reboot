"use client";

import InputFile from "@/components/ui/Inputs/InputFile";
import { UploadImageFunc } from "../types";

interface FileFieldProps {
	/** 기본 이미지 */
	defaultUrl?: string;
	/** 이미지 값 변경 함수 */
	onChange: (image: string, e: React.ChangeEvent<HTMLInputElement>) => void;
	/** 이미지 업로드 함수 */
	uploadImageFunc: UploadImageFunc;
	/** 필드명 @default "imageUrl" */
	name?: string;
}
export default function FileField({
	defaultUrl,
	name = "imageUrl",
	onChange,
	uploadImageFunc,
}: FileFieldProps) {
	async function handleUploadImage(e: React.ChangeEvent<HTMLInputElement>) {
		const res = await uploadImageFunc(e);
		onChange(res, e);
	}

	return (
		<InputFile
			defaultUrl={defaultUrl}
			label="이미지"
			name={name}
			isRequired
			onChange={handleUploadImage}
		/>
	);
}
