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
import { useUserStore } from "@/store/user.store";

export function useToggleConnectLike(postId: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (isLiked: boolean) => {
			if (isLiked) {
				return deleteConnectLike(postId);
			} else {
				return toggleConnectLike(postId);
			}
		},

		onMutate: async (_isLiked: boolean) => {
			await queryClient.cancelQueries({ queryKey: connectQueryKeys.postDetail(postId) });
			const previous = queryClient.getQueryData<ConnectPost>(connectQueryKeys.postDetail(postId));

			queryClient.setQueryData<ConnectPost>(connectQueryKeys.postDetail(postId), (old) => {
				if (!old) return old;
				return {
					...old,
					isLiked: !old.isLiked,
					likeCount: old.isLiked ? old.likeCount - 1 : old.likeCount + 1,
				};
			});

			return { previous };
		},

		onError: (_err, _vars, context) => {
			if (context?.previous) {
				queryClient.setQueryData(connectQueryKeys.postDetail(postId), context.previous);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: connectQueryKeys.postDetail(postId) });
		},
	});
}

export function useCreatePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createPost,

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});
}

export function useDeletePost(postId: number) {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: () => deletePost(postId),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			router.replace("/connect?deleted=true");
		},
	});
}

export function useUpdatePost(postId: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { title: string; content: string }) => updatePost(postId, data),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: connectQueryKeys.postDetail(postId) });
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});
}

export function useCreateComment(postId: number, onSuccess?: () => void) {
	const queryClient = useQueryClient();
	const { user } = useUserStore();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: createComment,

		onMutate: async (newComment: { postId: number; content: string }) => {
			await queryClient.cancelQueries({ queryKey: connectQueryKeys.postDetail(postId) });

			const previousData = queryClient.getQueryData(connectQueryKeys.postDetail(postId));

			queryClient.setQueryData(
				connectQueryKeys.postDetail(postId),
				(old: ConnectPost | undefined) => {
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
				},
			);

			return { previousData };
		},

		onError: (_err, _newComment, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(connectQueryKeys.postDetail(postId), context.previousData);
			}
			handleShowToast({ message: "댓글 등록에 실패했습니다.", status: "error" });
		},

		onSuccess: () => {
			onSuccess?.();
			queryClient.invalidateQueries({ queryKey: connectQueryKeys.postDetail(postId) });
			queryClient.invalidateQueries({ queryKey: ["header"] });
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
}

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
			await queryClient.cancelQueries({ queryKey: connectQueryKeys.postDetail(postId) });
			const previousData = queryClient.getQueryData(connectQueryKeys.postDetail(postId));

			queryClient.setQueryData(
				connectQueryKeys.postDetail(postId),
				(old: ConnectPost | undefined) => {
					if (!old) return old;
					return {
						...old,
						comments: old.comments.map((c) => (c.id === commentId ? { ...c, content } : c)),
					};
				},
			);

			onSuccess?.();
			handleShowToast({ message: "댓글이 수정되었습니다.", status: "success" });
			return { previousData };
		},

		onError: (_err, _vars, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(connectQueryKeys.postDetail(postId), context.previousData);
			}
			handleShowToast({ message: "댓글 수정에 실패했습니다.", status: "error" });
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: connectQueryKeys.postDetail(postId) });
			queryClient.invalidateQueries({ queryKey: ["header"] });
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
}

export function useDeleteComment(postId: number) {
	const queryClient = useQueryClient();
	const { handleShowToast } = useToast();

	return useMutation({
		mutationFn: (commentId: number) => deleteComment({ postId, commentId }),

		onMutate: async (commentId) => {
			await queryClient.cancelQueries({ queryKey: connectQueryKeys.postDetail(postId) });
			const previousData = queryClient.getQueryData(connectQueryKeys.postDetail(postId));

			queryClient.setQueryData(
				connectQueryKeys.postDetail(postId),
				(old: ConnectPost | undefined) => {
					if (!old) return old;
					return {
						...old,
						comments: old.comments.filter((c) => c.id !== commentId),
					};
				},
			);
			handleShowToast({ message: "댓글이 삭제되었습니다.", status: "success" });

			return { previousData };
		},

		onError: (_err, _vars, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(connectQueryKeys.postDetail(postId), context.previousData);
			}
			handleShowToast({ message: "댓글 삭제에 실패했습니다.", status: "error" });
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: connectQueryKeys.postDetail(postId) });
			queryClient.invalidateQueries({ queryKey: ["header"] });
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
}
