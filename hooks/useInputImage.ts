import { useEffect, useState, type ChangeEvent } from "react";

/**
<input type="file" name="file" ref={inputRef} onChange={changeFile} />
{previewUrl && <img src={previewUrl} alt="thumbnail" />}
<button onClick={resetFile}>Reset</button>
 */
interface InputImageProps {
	inputRef: React.Ref<HTMLInputElement>;
	defaultUrl?: string | null;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function useInputImage({ inputRef, defaultUrl = null, onChange }: InputImageProps) {
	const [previewUrl, setPreviewUrl] = useState<string | null>(defaultUrl);

	useEffect(() => {
		return () => revokePrevPreviewUrl();
	}, [previewUrl]);

	// 기존 썸네일 URL 메모리 해제
	function revokePrevPreviewUrl() {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
	}

	function resetFile() {
		revokePrevPreviewUrl();
		setPreviewUrl(null);

		const input = inputRef && "current" in inputRef ? inputRef.current : null;
		if (!input) return;
		input.value = "";

		// 파일 선택 해제 시 onChange를 직접 호출
		onChange?.({
			target: input,
			currentTarget: input,
		} as ChangeEvent<HTMLInputElement>);
	}

	async function changeFile(e: React.ChangeEvent<HTMLInputElement>) {
		// 새로운 썸네일 생성 및 표시
		const file = e.target.files?.[0];
		if (file) {
			const blob = await createThumbnail(file, 450);
			if (blob) {
				revokePrevPreviewUrl();
				setPreviewUrl(URL.createObjectURL(blob));
			}
		}
		// onChange 콜백 실행
		if (onChange) onChange(e);
	}

	function createThumbnail(file: File, maxSize = 450): Promise<Blob | null> {
		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement("canvas");
				let { width, height } = img;
				if (width > height) {
					if (width > maxSize) {
						height = Math.round(height * (maxSize / width));
						width = maxSize;
					}
				} else {
					if (height > maxSize) {
						width = Math.round(width * (maxSize / height));
						height = maxSize;
					}
				}
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext("2d");
				ctx?.drawImage(img, 0, 0, width, height);
				canvas.toBlob(resolve, "image/png");
				URL.revokeObjectURL(img.src);
			};
			img.src = URL.createObjectURL(file);
		});
	}

	return {
		previewUrl,
		setPreviewUrl,
		resetFile,
		changeFile,
	};
}
