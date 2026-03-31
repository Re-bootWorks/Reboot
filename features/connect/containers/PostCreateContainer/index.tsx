"use client";

import { useState } from "react";
import Button from "@/components/ui/Buttons/Button";
import Container from "@/components/layout/Container";
import PostEditor from "../../components/PostEditor";
import { useCreatePost } from "@/features/connect/mutations";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modals";
import { useLeaveConfirm } from "@/hooks/useLeaveConfirm";
import { useToast } from "@/providers/toast-provider";

export default function PostCreateContainer() {
	const router = useRouter();
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const { handleShowToast } = useToast();

	const isDirty = title.trim().length > 0 || content.replace(/<[^>]*>/g, "").trim().length > 0;
	const { showModal, handleConfirmLeave, handleCancelLeave } = useLeaveConfirm(isDirty);

	const getTextLength = (html: string) => {
		const plainText = html.replace(/<[^>]*>/g, "");
		return {
			withSpace: plainText.length,
			withoutSpace: plainText.replace(/\s/g, "").length,
		};
	};

	const { withSpace, withoutSpace } = getTextLength(content);
	const { mutate, isPending } = useCreatePost();

	return (
		<Container narrow>
			<div className="mt-12 space-y-4">
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
								handleShowToast({ message: "제목을 입력해주세요", status: "error" });
								return;
							}

							if (isEmptyContent) {
								handleShowToast({ message: "내용을 입력해주세요", status: "error" });
								return;
							}

							mutate(
								{ title, content },
								{
									onSuccess: () => {
										handleShowToast({ message: "게시글이 등록되었습니다", status: "success" });
										setTimeout(() => {
											router.push("/connect");
										}, 800);
									},
									onError: () => {
										handleShowToast({ message: "게시글 등록 실패", status: "error" });
									},
								},
							);
						}}>
						{isPending ? "등록 중..." : "등록"}
					</Button>
				</div>

				{/* 에디터 카드 */}
				<div className="mb-[84px] min-w-[343px] rounded-3xl bg-gray-50 px-1">
					<div className="flex flex-col rounded-[24px] bg-white p-4 md:p-10">
						<div>
							<PostEditor content={content} onChange={setContent} />
						</div>
						<div className="mt-4 text-xs text-gray-400">
							공백포함 : {withSpace}자 | 공백제외 : {withoutSpace}자
						</div>
					</div>
				</div>
			</div>

			{/* 나가기 확인 모달 */}
			<Modal
				isOpen={showModal}
				onClose={handleCancelLeave}
				hideCloseButton
				isCenterTitle
				title="등록하지 않고 나가시겠어요?"
				className="] w-[343px] rounded-3xl p-6 md:w-[560px] md:rounded-[40px] md:pt-12 md:pr-10 md:pb-10 md:pl-10"
				footer={
					<div className="flex gap-3">
						<Button
							onClick={handleCancelLeave}
							className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
							취소
						</Button>
						<Button
							onClick={handleConfirmLeave}
							className="flex-1 rounded-xl bg-purple-600 py-2.5 text-sm font-medium text-white hover:bg-purple-700">
							나가기
						</Button>
					</div>
				}>
				<p className="text-center text-sm text-gray-500">작성하신 모든 내용이 사라집니다.</p>
			</Modal>
		</Container>
	);
}
