import type { ConnectPost } from "@/features/connect/post/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
	toggleConnectLike,
	deleteConnectLike,
	toggleCommentLike,
	deleteCommentLike,
} from "./apis/fetchPostsClient";
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
import { useUser } from "@/hooks/useUser";

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

		onSuccess: () => {
			// lists만 stale 표시 → 목록으로 돌아갈 때 자동 갱신
			queryClient.invalidateQueries({
				queryKey: connectQueryKeys.lists(),
				refetchType: "none", // 즉시 refetch 안 함
			});
		},

		onError: (err, _vars, context) => {
			if (context?.previous) {
				queryClient.setQueryData(connectQueryKeys.detail(postId), context.previous);
			}
			console.error("[useToggleConnectLike]", err);
			handleShowToast({ message: "좋아요 처리에 실패했습니다.", status: "error" });
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
			console.error("[useCreatePost]", err);
			handleShowToast({ message: "게시글 등록에 실패했습니다.", status: "error" });
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
			console.error("[useDeletePost]", err);
			handleShowToast({ message: "게시글 삭제에 실패했습니다.", status: "error" });
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
			queryClient.invalidateQueries({ queryKey: connectQueryKeys.lists() }); // 목록 전체
		},

		onError: (err) => {
			console.error("[useUpdatePost]", err);
			handleShowToast({ message: "게시글 수정에 실패했습니다.", status: "error" });
		},
	});
}

// 댓글 작성 (Optimistic Update)
export function useCreateComment(postId: number, onSuccess?: () => void) {
	const queryClient = useQueryClient();
	const { user } = useUser();
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
					commentCount: old.commentCount + 1,
					comments: [
						{
							id: Date.now(),
							content: newComment.content,
							author: {
								id: user?.id ?? 0,
								name: user?.name ?? "사용자",
								image: user?.image ?? undefined,
							},
							createdAt: new Date().toISOString(),
							likeCount: 0,
							isLiked: false,
						},
						...old.comments,
					],
				};
			});

			return { previousData };
		},

		onSuccess: () => {
			onSuccess?.();
			queryClient.invalidateQueries({ queryKey: connectQueryKeys.detail(postId) });
			invalidateHeaderQueries(queryClient);
		},

		onError: (err, _newComment, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(connectQueryKeys.detail(postId), context.previousData);
			}
			console.error("[useCreateComment]", err);
			handleShowToast({ message: "댓글 등록에 실패했습니다.", status: "error" });
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

			return { previousData };
		},

		onSuccess: () => {
			onSuccess?.();
			handleShowToast({ message: "댓글이 수정되었습니다.", status: "success" });
			queryClient.invalidateQueries({ queryKey: connectQueryKeys.detail(postId) });
			invalidateHeaderQueries(queryClient);
		},

		// 실패 시 롤백
		onError: (err, _vars, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(connectQueryKeys.detail(postId), context.previousData);
			}
			console.error("[useUpdateComment]", err);
			handleShowToast({ message: "댓글 수정에 실패했습니다.", status: "error" });
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
					commentCount: old.commentCount - 1,
					comments: old.comments.filter((c) => c.id !== commentId),
				};
			});
			handleShowToast({ message: "댓글이 삭제되었습니다.", status: "success" }); // 낙관적으로 먼저 표시

			return { previousData };
		},

		// 실패 시 롤백
		onError: (err, _vars, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(connectQueryKeys.detail(postId), context.previousData);
			}
			console.error("[useDeleteComment]", err);
			handleShowToast({ message: "댓글 삭제에 실패했습니다.", status: "error" });
		},
		onSuccess: () => {
			invalidateHeaderQueries(queryClient); // 헤더 알림만 동기화
		},
	});
}

// 댓글 좋아요 토글 (Optimistic Update)
export function useToggleCommentLike(postId: number, commentId: number) {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: async (isLiked: boolean) => {
			if (isLiked) {
				return deleteCommentLike(postId, commentId);
			} else {
				return toggleCommentLike(postId, commentId);
			}
		},

		onMutate: async (isLiked: boolean) => {
			await queryClient.cancelQueries({ queryKey: connectQueryKeys.detail(postId) });
			const previous = queryClient.getQueryData<ConnectPost>(connectQueryKeys.detail(postId));

			queryClient.setQueryData<ConnectPost>(connectQueryKeys.detail(postId), (old) => {
				if (!old) return old;
				return {
					...old,
					comments: old.comments.map((c) =>
						c.id === commentId
							? {
									...c,
									isLiked: !isLiked,
									likeCount: isLiked ? c.likeCount - 1 : c.likeCount + 1,
								}
							: c,
					),
				};
			});

			return { previous };
		},

		onError: (_err, _vars, context) => {
			if (context?.previous) {
				queryClient.setQueryData(connectQueryKeys.detail(postId), context.previous);
			}
			handleShowToast({ message: "좋아요 처리에 실패했습니다.", status: "error" });
		},
	});
}
