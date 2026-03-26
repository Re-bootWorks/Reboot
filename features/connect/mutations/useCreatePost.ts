import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "../apis/uploadImage";
import { createPost } from "../apis/createPost";
export function useCreatePost() {
	return useMutation({
		mutationFn: async ({
			title,
			content,
			file,
		}: {
			title: string;
			content: string;
			file: File;
		}) => {
			// 이미지 업로드
			const imageUrl = await uploadImage(file);

			// 게시글 생성
			return createPost({
				title,
				content,
				imageUrl,
			});
		},
	});
}
