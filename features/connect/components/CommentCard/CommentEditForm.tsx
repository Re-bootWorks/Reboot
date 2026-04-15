"use client";

import { useRef } from "react";
import Image from "next/image";
import Button from "@/components/ui/Buttons/Button";
import IcPerson from "@/components/ui/icons/IcPerson";
import InputTextarea from "@/components/ui/Inputs/InputTextarea";
import RelativeTime from "@/components/ui/RelativeTime";

export interface CommentEditFormProps {
	value: string;
	onChange: (value: string) => void;
	onCancel: () => void;
	onSubmit: () => void;
	authorName: string;
	authorImage?: string;
	date: number;
	previewUrl: string | null;
	onImageChange: (file: File) => void;
	onImageRemove: () => void;
}

export default function CommentEditForm({
	value,
	onChange,
	onCancel,
	onSubmit,
	authorName,
	authorImage,
	date,
	previewUrl,
	onImageChange,
	onImageRemove,
}: CommentEditFormProps) {
	const fileRef = useRef<HTMLInputElement>(null);

	return (
		<div className="flex min-h-[96px] w-full flex-col gap-2 border-b border-gray-200">
			<div className="pt-2 pb-6 md:pt-4">
				<InputTextarea
					name="edit-comment"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="w-full bg-gray-50 px-3 py-2 text-sm text-gray-700 md:text-lg"
				/>

				{/* 이미지 미리보기 */}
				{previewUrl && (
					<div className="relative mt-2 h-24 w-24">
						<Image src={previewUrl} alt="첨부 이미지" fill className="rounded-lg object-cover" />
						<button
							onClick={onImageRemove}
							className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-700 text-[10px] text-white">
							✕
						</button>
					</div>
				)}

				<div className="flex items-center justify-between pt-2">
					{/* 작성자 + 날짜 */}
					<div className="flex items-center gap-2 text-xs text-gray-500">
						{authorImage ? (
							<div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
								<Image src={authorImage} alt={authorName} fill className="object-cover" />
							</div>
						) : (
							<IcPerson color="gray-400" />
						)}
						<span>{authorName}</span>
						<span>·</span>
						<RelativeTime date={date} fallback="date" />

						{/* 이미지 첨부 */}
						<button
							onClick={() => fileRef.current?.click()}
							className="ml-2 text-xs text-gray-400 hover:text-gray-600">
							📎
						</button>
						<input
							ref={fileRef}
							type="file"
							accept="image/*"
							className="hidden"
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) onImageChange(file);
							}}
						/>
					</div>

					{/* 버튼 */}
					<div className="flex gap-2">
						<Button
							onClick={onCancel}
							className="h-10 w-[4.5rem] rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-700 hover:border-purple-300 hover:bg-purple-300 hover:text-white">
							취소
						</Button>
						<Button onClick={onSubmit} className="h-10 w-[4.5rem] rounded-xl px-4 text-sm">
							수정
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
