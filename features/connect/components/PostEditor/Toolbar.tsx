import { Editor } from "@tiptap/react";
import {
	Bold,
	Italic,
	Underline as UnderlineIcon,
	List,
	Image as ImageIcon,
	AlignLeft,
	AlignCenter,
} from "lucide-react";
import { uploadImage } from "@/apis/images";

const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface Props {
	editor: Editor | null;
	onError?: (message: string) => void;
}

export default function Toolbar({ editor, onError }: Props) {
	if (!editor) return null;

	const btnClass = (active?: boolean) =>
		`flex h-8 w-8 items-center justify-center rounded-md transition
		${active ? "bg-purple-100 text-purple-600" : "text-gray-500 hover:bg-gray-100"}`;

	return (
		<div className="flex items-center gap-1 rounded-xl bg-gray-50 p-2">
			{/* 굵기 */}
			<button
				onClick={() => editor.chain().focus().toggleBold().run()}
				className={btnClass(editor.isActive("bold"))}>
				<Bold size={16} />
			</button>

			{/* 기울기 */}
			<button
				onClick={() => editor.chain().focus().toggleItalic().run()}
				className={btnClass(editor.isActive("italic"))}>
				<Italic size={16} />
			</button>

			{/* 밑줄 */}
			<button
				onClick={() => editor.chain().focus().toggleUnderline().run()}
				className={btnClass(editor.isActive("underline"))}>
				<UnderlineIcon size={16} />
			</button>

			{/* | */}
			<div className="mx-1 h-4 w-px bg-gray-300" />

			{/* 왼쪽 정렬 */}
			<button
				onClick={() => editor.chain().focus().setTextAlign("left").run()}
				className={btnClass()}>
				<AlignLeft size={16} />
			</button>

			{/* 중앙 정렬 */}
			<button
				onClick={() => editor.chain().focus().setTextAlign("center").run()}
				className={btnClass()}>
				<AlignCenter size={16} />
			</button>

			{/* 목록 */}
			<button
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				className={btnClass(editor.isActive("bulletList"))}>
				<List size={16} />
			</button>

			{/* | */}
			<div className="mx-1 h-4 w-px bg-gray-300" />

			{/* 이미지 */}
			<button
				onClick={() => {
					const input = document.createElement("input");
					input.type = "file";
					input.accept = "image/jpeg,image/png,image/webp,image/gif";

					input.onchange = async () => {
						const file = input.files?.[0];
						if (!file) return;

						if (!ALLOWED_CONTENT_TYPES.includes(file.type)) {
							onError?.("JPEG, PNG, WebP, GIF 형식만 업로드할 수 있습니다.");
							return;
						}

						try {
							const url = await uploadImage(file);
							editor.chain().focus().setImage({ src: url }).run();
						} catch (error) {
							if (error instanceof Error) {
								onError?.(error.message);
							} else {
								onError?.("이미지 업로드에 실패했습니다.");
							}
						}
					};
					input.click();
				}}
				className={btnClass()}>
				<ImageIcon size={16} />
			</button>
		</div>
	);
}
