import { useMutation } from "@tanstack/react-query";
import { uploadProfileImage } from "./apis";

export function useUploadProfileImage() {
	return useMutation({
		mutationFn: uploadProfileImage,
	});
}
