"use client";

import NextImage from "next/image";
import { useImperativeHandle, useRef } from "react";
import { cn } from "@/utils/cn";
import { IcImagePlus } from "../../icons";
import DeleteButton from "../../Buttons/DeleteButton";
import useInputImage from "@/hooks/useInputImage";

interface InputFileProps extends React.InputHTMLAttributes<HTMLInputElement> {
	/** 식별 ID */
	id: string;
	/** 데이터 필드명 */
	name: string;
	/** 컴포넌트 제어 참조(reset) */
	ref?: React.Ref<InputFileHandle>;
	/** 첨부 파일 타입 */
	accept?: string;
	/** 썸네일 이미지 크기 */
	thumbSize?: "large" | "small";
	/** 기본 썸네일 이미지 URL */
	defaultUrl?: string | null;
	/** 파일 변경 시 콜백 */
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * const ref = useRef<InputFileHandle>(null);
 * <InputFile ref={ref} id="image" name="image" />
 */
export interface InputFileHandle {
	reset: () => void;
}

export default function InputFile({
	ref,
	id,
	name,
	defaultUrl = null,
	thumbSize = "large",
	accept = "image/*",
	onChange,
	...props
}: InputFileProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const { previewUrl, resetFile, changeFile } = useInputImage({
		inputRef,
		defaultUrl,
		onChange,
	});
	useImperativeHandle(ref, () => ({ reset: resetFile }));

	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-xl bg-gray-50",
				thumbSize === "large" && "h-[147px] w-[147px]",
				thumbSize === "small" && "h-[114px] w-[114px]",
			)}>
			<label htmlFor={id} className={!previewUrl ? "cursor-pointer" : "cursor-initial"}>
				{!previewUrl && <NoPreview thumbSize={thumbSize} />}
				{previewUrl && (
					<>
						<NextImage src={previewUrl} alt="thumbnail" fill className="object-cover" />
						<DeleteButton
							className="absolute top-2.5 right-2.5 z-10 cursor-pointer"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								resetFile();
							}}
						/>
					</>
				)}
				<input
					{...props}
					ref={inputRef}
					id={id}
					name={name}
					accept={accept}
					onChange={changeFile}
					type="file"
					className="hidden"
				/>
			</label>
		</div>
	);
}

function NoPreview({ thumbSize }: Pick<InputFileProps, "thumbSize">) {
	return (
		<div
			className={cn(
				"flex h-full w-full flex-col items-center justify-center gap-y-2",
				thumbSize === "small" && "text-sm",
			)}>
			<IcImagePlus />
			<span className="text-gray-500 select-none">파일 첨부</span>
		</div>
	);
}
