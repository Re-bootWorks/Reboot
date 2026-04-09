import type { ConnectPost } from "@/features/connect/post/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toggleConnectLike, deleteConnectLike } from "./apis/fetchPostsClient";
import { createPost } from "@/features/connect/apis/createPost";
import { deletePost } from "@/features/connect/apis/deletePost";
import { useRouter } from "next/navigation";
import { updatePost } from "@/features/connect/apis/updatePost";
import { createComment } from "@/features/connect/apis/createComment";
import { updateComment } from "@/features/connect/apis/updateComment";
import { useToast } from "@/providers/toast-provider";
import { deleteComment } from "@/features/connect/apis/deleteComment";
import { connectQueryKeys } from "@/features/connect/queries";
import { headerQueryKeys } from "@/features/header/queries";
import { useUserStore } from "@/store/user.store";

// 댓글/좋아요 뮤테이션 후 공통으로 무효화할 헤더 관련 쿼리
function invalidateHeaderQueries(queryClient: ReturnType<typeof useQueryClient>) {
	queryClient.invalidateQueries({ queryKey: headerQueryKeys.notifications }); // 알림 목록
	queryClient.invalidateQueries({ queryKey: headerQueryKeys.notificationsCount }); // 읽지 않은 알림 수
}

// 게시글 좋아요 토글 (Optimistic Update)
export function useToggleConnectLike(postId: number) {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: async (isLiked: boolean) => {
			if (isLiked) {
				return deleteConnectLike(postId); // 좋아요 취소
			} else {
				return toggleConnectLike(postId); // 좋아요 등록
			}
		},

		// Optimistic Update: 서버 응답 전 UI 선반영
		onMutate: async (_isLiked: boolean) => {
			await queryClient.cancelQueries({ queryKey: connectQueryKeys.detail(postId) });
			const previous = queryClient.getQueryData<ConnectPost>(connectQueryKeys.detail(postId));

			queryClient.setQueryData<ConnectPost>(connectQueryKeys.detail(postId), (old) => {
				if (!old) return old;
				return {
					...old,
					isLiked: !old.isLiked,
					likeCount: old.isLiked ? old.likeCount - 1 : old.likeCount + 1,
				};
			});

			return { previous };
		},

		// 실패 시 롤백 + 사용자/개발자 에러 처리
		onError: (err, _vars, context) => {
			if (context?.previous) {
				queryClient.setQueryData(connectQueryKeys.detail(postId), context.previous);
			}
			console.error("[useToggleConnectLike]", err); // 개발자용
			handleShowToast({ message: "좋아요 처리에 실패했습니다.", status: "error" }); // 사용자용
		},

		// 성공/실패 무관하게 최종 동기화
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: connectQueryKeys.detail(postId) });
		},
	});
}

// 게시글 작성
export function useCreatePost() {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: createPost,

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: connectQueryKeys.lists() }); // 목록 전체 무효화
		},

		onError: (err) => {
			console.error("[useCreatePost]", err); // 개발자용
			handleShowToast({ message: "게시글 등록에 실패했습니다.", status: "error" }); // 사용자용
		},
	});
}

// 게시글 삭제
export function useDeletePost(postId: number) {
	const queryClient = useQueryClient();
	const router = useRouter();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: () => deletePost(postId),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: connectQueryKeys.lists() }); // 목록 전체 무효화
			router.replace("/connect?deleted=true");
		},

		onError: (err) => {
			console.error("[useDeletePost]", err); // 개발자용
			handleShowToast({ message: "게시글 삭제에 실패했습니다.", status: "error" }); // 사용자용
		},
	});
}

// 게시글 수정
export function useUpdatePost(postId: number) {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: (data: { title: string; content: string }) => updatePost(postId, data),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: connectQueryKeys.detail(postId) }); // 해당 게시글 상세
			queryClient.invalidateQueries({ queryKey: connectQueryKeys.lists() }); // 목록 전체
		},

		onError: (err) => {
			console.error("[useUpdatePost]", err); // 개발자용
			handleShowToast({ message: "게시글 수정에 실패했습니다.", status: "error" }); // 사용자용
		},
	});
}

// 댓글 작성 (Optimistic Update)
export function useCreateComment(postId: number, onSuccess?: () => void) {
	const queryClient = useQueryClient();
	const { user } = useUserStore();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: createComment,

		// Optimistic Update: 댓글 목록 최상단에 임시 댓글 선반영
		onMutate: async (newComment: { postId: number; content: string }) => {
			await queryClient.cancelQueries({ queryKey: connectQueryKeys.detail(postId) });
			const previousData = queryClient.getQueryData(connectQueryKeys.detail(postId));

			queryClient.setQueryData(connectQueryKeys.detail(postId), (old: ConnectPost | undefined) => {
				if (!old) return old;
				return {
					...old,
					comments: [
						{
							id: Date.now(),
							content: newComment.content,
							isPending: true,
							author: {
								id: user?.id ?? 0,
								name: user?.name ?? "사용자",
							},
							createdAt: new Date().toISOString(),
						},
						...old.comments,
					],
				};
			});

			return { previousData };
		},

		// 실패 시 롤백 + 사용자/개발자 에러 처리
		onError: (err, _newComment, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(connectQueryKeys.detail(postId), context.previousData);
			}
			console.error("[useCreateComment]", err); // 개발자용
			handleShowToast({ message: "댓글 등록에 실패했습니다.", status: "error" }); // 사용자용
		},

		onSuccess: () => {
			onSuccess?.();
			queryClient.invalidateQueries({ queryKey: connectQueryKeys.detail(postId) }); // 게시글 상세(댓글 수 동기화)
			invalidateHeaderQueries(queryClient);
		},
	});
}

// 댓글 수정 (Optimistic Update)
export function useUpdateComment({
	postId,
	onSuccess,
}: {
	postId: number;
	onSuccess?: () => void;
}) {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: updateComment,

		// Optimistic Update: 수정된 내용 즉시 반영
		onMutate: async ({ commentId, content }) => {
			await queryClient.cancelQueries({ queryKey: connectQueryKeys.detail(postId) });
			const previousData = queryClient.getQueryData(connectQueryKeys.detail(postId));

			queryClient.setQueryData(connectQueryKeys.detail(postId), (old: ConnectPost | undefined) => {
				if (!old) return old;
				return {
					...old,
					comments: old.comments.map((c) => (c.id === commentId ? { ...c, content } : c)),
				};
			});

			onSuccess?.();
			handleShowToast({ message: "댓글이 수정되었습니다.", status: "success" }); // 낙관적으로 먼저 표시
			return { previousData };
		},

		// 실패 시 롤백 + 사용자/개발자 에러 처리
		onError: (err, _vars, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(connectQueryKeys.detail(postId), context.previousData);
			}
			console.error("[useUpdateComment]", err); // 개발자용
			handleShowToast({ message: "댓글 수정에 실패했습니다.", status: "error" }); // 사용자용
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: connectQueryKeys.detail(postId) }); // 게시글 상세(댓글 수 동기화)
			invalidateHeaderQueries(queryClient);
		},
	});
}

// 댓글 삭제 (Optimistic Update)
export function useDeleteComment(postId: number) {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: (commentId: number) => deleteComment({ postId, commentId }),

		// Optimistic Update: 댓글 목록에서 즉시 제거
		onMutate: async (commentId) => {
			await queryClient.cancelQueries({ queryKey: connectQueryKeys.detail(postId) });
			const previousData = queryClient.getQueryData(connectQueryKeys.detail(postId));

			queryClient.setQueryData(connectQueryKeys.detail(postId), (old: ConnectPost | undefined) => {
				if (!old) return old;
				return {
					...old,
					comments: old.comments.filter((c) => c.id !== commentId),
				};
			});
			handleShowToast({ message: "댓글이 삭제되었습니다.", status: "success" }); // 낙관적으로 먼저 표시

			return { previousData };
		},

		// 실패 시 롤백 + 사용자/개발자 에러 처리
		onError: (err, _vars, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(connectQueryKeys.detail(postId), context.previousData);
			}
			console.error("[useDeleteComment]", err); // 개발자용
			handleShowToast({ message: "댓글 삭제에 실패했습니다.", status: "error" }); // 사용자용
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: connectQueryKeys.detail(postId) }); // 게시글 상세(댓글 수 동기화)
			invalidateHeaderQueries(queryClient);
		},
	});
}
