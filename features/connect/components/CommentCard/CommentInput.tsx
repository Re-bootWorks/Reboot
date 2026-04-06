"use client";
import { useRef, useState } from "react";
import { uploadImage } from "@/apis/images";
import { buildCommentContent } from "./parseCommentContent";
import Image from "next/image";
import Button from "@/components/ui/Buttons/Button";

interface CommentInputProps {
	onSubmit: (content: string) => void;
	isPending?: boolean;
}

export default function CommentInput({ onSubmit, isPending }: CommentInputProps) {
	const [text, setText] = useState("");
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const fileRef = useRef<HTMLInputElement>(null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setPreviewUrl(URL.createObjectURL(file)); // 로컬 미리보기
		setIsUploading(true);
		try {
			const url = await uploadImage(file); // S3 업로드
			setImageUrl(url);
		} catch {
			alert("이미지 업로드에 실패했습니다.");
			setPreviewUrl(null);
		} finally {
			setIsUploading(false);
		}
	};

	const handleSubmit = () => {
		if (!text.trim() && !imageUrl) return;
		const content = buildCommentContent(text.trim(), imageUrl ?? undefined);
		onSubmit(content);
		setText("");
		setPreviewUrl(null);
		setImageUrl(null);
	};

	return (
		<div className="flex flex-1 flex-col gap-2 rounded-2xl bg-gray-100 px-2 py-2">
			{/* 텍스트 + 이미지첨부 + 등록버튼 */}
			<div className="flex items-center gap-2.5">
				{/* 이미지 첨부 버튼 */}
				<button
					onClick={() => fileRef.current?.click()}
					disabled={isUploading}
					className="shrink-0 text-gray-400 hover:text-gray-600">
					{isUploading ? "⏳" : "📎"}
				</button>
				<input
					ref={fileRef}
					type="file"
					accept="image/*"
					className="hidden"
					onChange={handleFileChange}
				/>

				<textarea
					value={text}
					onChange={(e) => {
						setText(e.target.value);
						e.target.style.height = "auto";
						e.target.style.height = e.target.scrollHeight + "px";
					}}
					placeholder="여기에 댓글을 남겨보세요"
					rows={1}
					className="min-w-0 flex-1 resize-none bg-gray-100 outline-none placeholder:text-gray-500"
					style={{ height: "auto", overflowY: "hidden" }}
				/>

				<Button
					onClick={handleSubmit}
					disabled={isPending || isUploading}
					className="h-12 w-8 shrink-0 rounded-[0.75rem] px-6 py-2 text-base font-semibold">
					{isUploading ? "..." : "등록"}
				</Button>
			</div>

			{/* 이미지 미리보기 */}
			{previewUrl && (
				<div className="relative h-24 w-24">
					<Image src={previewUrl} alt="첨부 이미지" fill className="rounded-lg object-cover" />
					<button
						onClick={() => {
							setPreviewUrl(null);
							setImageUrl(null);
						}}
						className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-700 text-[10px] text-white">
						✕
					</button>
				</div>
			)}
		</div>
	);
}
