"use client";

import NextImage from "next/image";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { IcDelete, IcImagePlus } from "../icons";
import { cn } from "@/utils/cn";

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
	const [previewUrl, setPreviewUrl] = useState<string | null>(defaultUrl);
	const inputRef = useRef<HTMLInputElement>(null);
	useImperativeHandle(ref, () => ({ reset: handleClickButtonDelete }));

	useEffect(() => {
		return () => revokePrevPreviewUrl();
	}, [previewUrl]);

	// 기존 썸네일 URL 메모리 해제
	function revokePrevPreviewUrl() {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
	}

	function handleClickButtonDelete() {
		revokePrevPreviewUrl();
		setPreviewUrl(null);
		if (inputRef.current) inputRef.current.value = "";
	}

	async function handleChangeInputFile(e: React.ChangeEvent<HTMLInputElement>) {
		// 새로운 썸네일 생성 및 표시
		const file = e.target.files?.[0];
		if (file) {
			const blob = await createThumbnail(file, 450);
			if (blob) {
				revokePrevPreviewUrl();
				setPreviewUrl(URL.createObjectURL(blob));
			}
		}
		// onChange 콜백 실행
		if (onChange) onChange(e);
	}

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
						<DeleteButton onClick={handleClickButtonDelete} />
					</>
				)}
				<input
					{...props}
					ref={inputRef}
					id={id}
					name={name}
					accept={accept}
					disabled={!!previewUrl}
					onChange={handleChangeInputFile}
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

function DeleteButton({ onClick }: { onClick: () => void }) {
	return (
		<button
			type="button"
			className="absolute top-2.5 right-2.5 z-10 flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full bg-black p-0.5"
			onClick={(e) => {
				e.preventDefault();
				onClick();
			}}>
			<IcDelete color="white" />
		</button>
	);
}

function createThumbnail(file: File, maxSize = 450): Promise<Blob | null> {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			let { width, height } = img;
			if (width > height) {
				if (width > maxSize) {
					height = Math.round(height * (maxSize / width));
					width = maxSize;
				}
			} else {
				if (height > maxSize) {
					width = Math.round(width * (maxSize / height));
					height = maxSize;
				}
			}
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d");
			ctx?.drawImage(img, 0, 0, width, height);
			canvas.toBlob(resolve, "image/png");
			URL.revokeObjectURL(img.src);
		};
		img.src = URL.createObjectURL(file);
	});
}
