"use client";

import { useState } from "react";
import Button from "@/components/ui/Buttons/Button";
import Container from "@/components/layout/Container";
import PostEditor from "../../components/PostEditor";
import { useCreatePost } from "@/features/connect/mutations";
import Toast from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

type ToastType = {
	id: number;
	message: string;
	status?: "success" | "error";
};

export default function PostCreateContainer() {
	const router = useRouter();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [toasts, setToasts] = useState<ToastType[]>([]);
	const getTextLength = (html: string) => {
		const plainText = html.replace(/<[^>]*>/g, "");
		return {
			withSpace: plainText.length,
			withoutSpace: plainText.replace(/\s/g, "").length,
		};
	};
	const addToast = (message: string, status?: "success" | "error") => {
		const id = Date.now();

		setToasts((prev) => [...prev, { id, message, status }]);

		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id));
		}, 2000);
	};
	const { withSpace, withoutSpace } = getTextLength(content);
	const { mutate, isPending } = useCreatePost();

	return (
		<Container narrow>
			<div className="space-y-4">
				{/* 제목 */}
				<div className="flex min-w-[343px] items-center gap-2">
					<div className="relative min-w-0 flex-1">
						<input
							value={title}
							onChange={(e) => {
								if (e.target.value.length <= 30) {
									setTitle(e.target.value);
								}
							}}
							placeholder="제목을 입력해주세요"
							className="w-full border-b border-gray-200 bg-transparent px-2 py-1.5 text-base leading-6 font-semibold tracking-[-0.32px] outline-none placeholder:text-gray-400 md:text-[32px] md:leading-[36px] md:tracking-[-0.64px]"
						/>

						<span className="absolute top-1/2 right-2 -translate-y-1/2 text-sm text-gray-400">
							{title.length}/30
						</span>
					</div>

					<Button
						className="h-[40px] w-[80px] shrink-0 rounded-[10px] bg-gray-100 px-4 text-gray-600 hover:bg-gray-100 hover:text-gray-400"
						disabled={isPending}
						onClick={() => {
							const isEmptyContent = content.replace(/<[^>]*>/g, "").trim().length === 0;

							if (!title.trim()) {
								addToast("제목을 입력해주세요", "error");
								return;
							}

							if (isEmptyContent) {
								addToast("내용을 입력해주세요", "error");
								return;
							}

							mutate(
								{ title, content },
								{
									onSuccess: () => {
										addToast("게시글이 등록되었습니다", "success");
										setTimeout(() => {
											router.push("/connect");
										}, 800);
									},
									onError: () => {
										addToast("게시글 등록 실패", "error");
									},
								},
							);
						}}>
						{isPending ? "등록 중..." : "등록"}
					</Button>
				</div>

				{/* 에디터 카드 추가 */}
				<div className="min-w-[343px] rounded-3xl bg-gray-50 px-1">
					<div className="flex flex-col rounded-[24px] bg-white p-4 md:p-10">
						{/* toolbar 자리 */}
						<div>
							<PostEditor content={content} onChange={setContent} />
						</div>

						{/* 글자수 */}
						<div className="mt-4 text-xs text-gray-400">
							공백포함 : {withSpace}자 | 공백제외 : {withoutSpace}자
						</div>
					</div>
				</div>
			</div>
			<Toast toasts={toasts} />
		</Container>
	);
}
