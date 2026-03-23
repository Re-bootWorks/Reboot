"use client";

import NextImage from "next/image";
import { useImperativeHandle, useRef } from "react";
import { cn } from "@/utils/cn";
import { InputFieldWrapper } from "../InputFieldWrapper";
import { IcImagePlus } from "../../icons";
import DeleteButton from "../../Buttons/DeleteButton";
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
	label,
	ref,
	name,
	isRequired = false,
	defaultUrl = null,
	thumbSize = "large",
	accept = "image/*",
	hintText,
	isDestructive = false,
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
						"relative overflow-hidden rounded-xl bg-gray-50 transition-colors",
						thumbSize === "large" && "h-[147px] w-[147px]",
						thumbSize === "small" && "h-[114px] w-[114px]",
						!isDestructive
							? "border border-transparent focus-within:border-purple-500"
							: "border-error border",
					)}>
					<label htmlFor={id} className={!previewUrl ? "cursor-pointer" : "cursor-initial"}>
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
