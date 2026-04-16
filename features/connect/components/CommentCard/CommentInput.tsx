"use client";
import { useRef, useState } from "react";
import { uploadImage } from "@/apis/images";
import { buildCommentContent } from "./parseCommentContent";
import Image from "next/image";
import Button from "@/components/ui/Buttons/Button";
import { useToast } from "@/providers/toast-provider";
import { IcImagePlus } from "@/components/ui/icons";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 1024 * 1024; // 1MB

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
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { handleShowToast } = useToast();

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// 타입 검사 추가
		if (!ALLOWED_TYPES.includes(file.type)) {
			handleShowToast({
				message: "JPEG, PNG, WebP, GIF 형식만 업로드 가능합니다.",
				status: "error",
			});
			e.target.value = "";
			return;
		}

		// 크기 검사 추가
		if (file.size > MAX_SIZE) {
			handleShowToast({ message: "파일 크기는 1MB를 초과할 수 없습니다.", status: "error" });
			e.target.value = "";
			return;
		}

		setPreviewUrl(URL.createObjectURL(file));
		setIsUploading(true);
		try {
			const url = await uploadImage(file);
			setImageUrl(url);
		} catch {
			handleShowToast({ message: "이미지 업로드에 실패했습니다.", status: "error" });
		} finally {
			setIsUploading(false);
			e.target.value = ""; // 같은 파일 재선택 가능하도록
		}
	};

	const handleSubmit = () => {
		if (!text.trim() && !imageUrl) return;
		const content = buildCommentContent(text.trim(), imageUrl ?? undefined);
		onSubmit(content);
		setText("");
		setPreviewUrl(null);
		setImageUrl(null);
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
		}
	};

	return (
		<div className="flex flex-1 flex-col gap-1.5 rounded-xl bg-gray-100 px-1.5 py-1.5 md:gap-2 md:rounded-2xl md:px-2 md:py-2">
			{/* 텍스트 + 이미지첨부 + 등록버튼 */}
			<div className="flex items-center gap-2.5">
				{/* 이미지 첨부 버튼 */}
				<button
					onClick={() => fileRef.current?.click()}
					disabled={isUploading}
					className="shrink-0 px-1 text-gray-400 hover:text-gray-600 disabled:opacity-40">
					<IcImagePlus size="sm" color="gray-400" />
				</button>
				<div className="h-4 w-px bg-gray-400" />
				<input
					ref={fileRef}
					type="file"
					accept="image/*"
					className="hidden"
					onChange={handleFileChange}
				/>

				<textarea
					ref={textareaRef}
					value={text}
					onChange={(e) => {
						setText(e.target.value);
						e.target.style.height = "auto";
						e.target.style.height = e.target.scrollHeight + "px";
					}}
					placeholder="여기에 댓글을 남겨보세요"
					rows={1}
					className="min-w-0 flex-1 resize-none bg-gray-100 text-sm outline-none placeholder:text-gray-500 md:text-base"
					style={{ height: "auto", overflowY: "hidden" }}
				/>

				<Button
					onClick={handleSubmit}
					disabled={isPending || isUploading}
					sizes="small"
					className="h-9 w-auto shrink-0 rounded-[0.75rem] text-sm font-semibold md:h-12 md:px-6 md:py-2 md:text-base">
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
