"use client";

import NextImage from "next/image";
import { useEffect, useImperativeHandle, useRef } from "react";
import { cn } from "@/utils/cn";
import { InputFieldWrapper } from "../InputFieldWrapper";
import { IcImagePlus } from "../../icons";
import DeleteButton from "../../Buttons/DeleteButton";
import LoaderDots from "../../LoaderDots";
import useInputImage from "@/hooks/useInputImage";

interface InputFileProps extends React.InputHTMLAttributes<HTMLInputElement> {
	/** 컴포넌트 제어 참조(reset) */
	ref?: React.Ref<InputFileHandle>;
	/** 데이터 필드명 */
	name: string;
	/** 라벨명 */
	label?: string;
	/** 필수 작성 여부 */
	isRequired?: boolean;
	/** 입력 필드 하단에 표시되는 힌트 또는 에러 메시지 */
	hintText?: string;
	/** 에러 상태 여부 */
	isDestructive?: boolean;
	/**
	 * `input`의 accept
	 * @default PNG·JPEG·GIF·WebP
	 */
	accept?: string;
	/** 썸네일 이미지 크기 */
	thumbSize?: "large" | "small";
	/** 기본 썸네일 이미지 URL */
	defaultUrl?: string | null;
	/** 파일 변경 시 콜백 */
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	/** 업로드 진행 중 여부 */
	isPending?: boolean;
}

/**
 * @example
 * const ref = useRef<InputFileHandle>(null);
 * <InputFile ref={ref} id="image" name="image" isPending={true} />
 */
export interface InputFileHandle {
	reset: () => void;
}

export const IMAGE_ACCEPT = "image/png, image/jpeg, image/gif, image/webp";
export const IMAGE_ACCEPTED_EXTS: string[] = IMAGE_ACCEPT.split(", ");

export default function InputFile({
	label,
	ref,
	name,
	isRequired = false,
	defaultUrl = null,
	thumbSize = "large",
	accept = IMAGE_ACCEPT,
	hintText,
	isDestructive = false,
	isPending = false,
	onChange,
	...props
}: InputFileProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const { previewUrl, setPreviewUrl, resetFile, changeFile } = useInputImage({
		inputRef,
		defaultUrl,
		onChange,
	});
	useImperativeHandle(ref, () => ({ reset: resetFile }));

	useEffect(() => {
		if (defaultUrl) {
			setPreviewUrl(defaultUrl);
		}
	}, [defaultUrl, setPreviewUrl]);

	function handleDeleteButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		e.stopPropagation();
		resetFile();
	}

	return (
		<InputFieldWrapper
			label={label}
			isRequired={isRequired}
			hintText={hintText}
			isDestructive={isDestructive}>
			{({ id, descriptionId }) => (
				<div
					className={cn(
						"overflow-hidden rounded-xl bg-gray-50 transition-colors",
						thumbSize === "large" && "h-[147px] w-[147px]",
						thumbSize === "small" && "h-[114px] w-[114px]",
						!isDestructive
							? "border border-transparent focus-within:border-purple-500"
							: "border-error border",
					)}>
					<label
						htmlFor={id}
						className={cn(
							"relative block h-full w-full",
							isPending ? "pointer-events-none" : !previewUrl ? "cursor-pointer" : "cursor-initial",
						)}>
						{isPending && (
							<div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-black/40">
								<LoaderDots size="xs" className="fill-white" />
							</div>
						)}
						{!previewUrl && <NoPreview thumbSize={thumbSize} />}
						{previewUrl && (
							<>
								<NextImage src={previewUrl} alt="thumbnail" fill className="object-cover" />
								<DeleteButton
									className="absolute top-2.5 right-2.5 z-10 cursor-pointer"
									onClick={handleDeleteButtonClick}
								/>
							</>
						)}
						<input
							ref={inputRef}
							id={id}
							name={name}
							accept={accept}
							required={isRequired}
							onChange={changeFile}
							aria-describedby={hintText ? descriptionId : undefined}
							type="file"
							className="hidden"
							{...props}
						/>
					</label>
				</div>
			)}
		</InputFieldWrapper>
	);
}

function NoPreview({ thumbSize }: Pick<InputFileProps, "thumbSize">) {
	return (
		<div
			className={cn(
				"flex h-full w-full cursor-pointer flex-col items-center justify-center gap-y-2",
				thumbSize === "small" && "text-sm",
			)}>
			<IcImagePlus />
			<span className="text-gray-500 select-none">파일 첨부</span>
		</div>
	);
}
