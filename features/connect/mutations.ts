import type { ConnectPost } from "@/features/connect/post/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toggleConnectLike, deleteConnectLike } from "./apis/fetchPostsClient";
import { createPost } from "@/features/connect/apis/createPost";
import { deletePost } from "@/features/connect/apis/deletePost";
import { useRouter } from "next/navigation";
import { updatePost } from "@/features/connect/apis/updatePost";

export function useToggleConnectLike(postId: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const current = queryClient.getQueryData<ConnectPost>(["postDetail", postId]);
			// isLiked 상태에 따라 POST/DELETE 분기
			if (current?.isLiked) {
				return deleteConnectLike(postId);
			} else {
				return toggleConnectLike(postId);
			}
		},

		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ["postDetail", postId] });
			const previous = queryClient.getQueryData<ConnectPost>(["postDetail", postId]);

			queryClient.setQueryData<ConnectPost>(["postDetail", postId], (old) => {
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
				queryClient.setQueryData(["postDetail", postId], context.previous);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["postDetail", postId] });
		},
	});
}

export function useCreatePost() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createPost,

		onSuccess: () => {
			// 목록 갱신
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
			router.replace("/connect");
		},
	});
}

export function useUpdatePost(postId: number) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { title: string; content: string }) => updatePost(postId, data),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["postDetail", postId] });
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});
}
