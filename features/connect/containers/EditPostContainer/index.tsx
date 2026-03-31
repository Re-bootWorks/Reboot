"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPostDetailClient } from "@/features/connect/apis/getPostDetailClient";
import { useUpdatePost } from "@/features/connect/mutations";
import PostEditor from "@/features/connect/components/PostEditor";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Buttons/Button";
import { useRouter } from "next/navigation";
import { useToast } from "@/providers/toast-provider";

export default function EditPostContainer({ id }: { id: number }) {
	const router = useRouter();
	const { handleShowToast } = useToast();

	const { data } = useQuery({
		queryKey: ["postDetail", id],
		queryFn: () => getPostDetailClient(id),
	});

	const { mutate: updatePost, isPending } = useUpdatePost(id);

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	const getTextLength = (html: string) => {
		const plainText = html.replace(/<[^>]*>/g, "");
		return {
			withSpace: plainText.length,
			withoutSpace: plainText.replace(/\s/g, "").length,
		};
	};

	const { withSpace, withoutSpace } = getTextLength(content);

	useEffect(() => {
		if (data) {
			setTitle(data.title);
			setContent(data.content);
		}
	}, [data]);

	const handleSubmit = () => {
		const isEmptyContent = content.replace(/<[^>]*>/g, "").trim().length === 0;

		if (!title.trim()) {
			handleShowToast({ message: "제목을 입력해주세요", status: "error" }); // ✅
			return;
		}

		if (isEmptyContent) {
			handleShowToast({ message: "내용을 입력해주세요", status: "error" }); // ✅
			return;
		}

		updatePost(
			{ title, content },
			{
				onSuccess: () => {
					handleShowToast({ message: "게시글이 수정되었습니다", status: "success" }); // ✅
					setTimeout(() => {
						router.replace(`/connect/${id}`);
					}, 800);
				},
				onError: () => {
					handleShowToast({ message: "게시글 수정 실패", status: "error" }); // ✅
				},
			},
		);
	};

	if (!data) return <div>로딩중...</div>;

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
						className="h-[40px] w-[80px] shrink-0 rounded-[10px] bg-purple-500 px-4 text-white hover:bg-purple-500"
						disabled={isPending}
						onClick={handleSubmit}>
						{isPending ? "수정 중..." : "수정"}
					</Button>
				</div>

				{/* 에디터 카드 */}
				<div className="min-w-[343px] rounded-3xl bg-gray-50 px-1">
					<div className="flex flex-col rounded-[24px] bg-white p-4 md:p-10">
						<PostEditor content={content} onChange={setContent} />

						{/* 글자수 */}
						<div className="mt-4 text-xs text-gray-400">
							공백포함 : {withSpace}자 | 공백제외 : {withoutSpace}자
						</div>
					</div>
				</div>
			</div>
		</Container>
	);
}
