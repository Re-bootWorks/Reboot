import { Editor } from "@tiptap/react";
import Button from "@/components/ui/Buttons/Button";

interface Props {
	editor: Editor | null;
}

export default function Toolbar({ editor }: Props) {
	if (!editor) return null;

	return (
		<div className="flex gap-2 border-b p-2">
			{/* Bold */}
			<Button
				sizes="small"
				colors="grayBorder"
				className={`w-auto px-3 ${
					editor.isActive("bold") ? "border-purple-500 text-purple-600" : ""
				}`}
				onClick={() => editor.chain().focus().toggleBold().run()}>
				B
			</Button>

			{/* Italic */}
			<Button
				sizes="small"
				colors="grayBorder"
				className={`w-auto px-3 ${
					editor.isActive("italic") ? "border-purple-500 text-purple-600" : ""
				}`}
				onClick={() => editor.chain().focus().toggleItalic().run()}>
				I
			</Button>

			{/* Heading */}
			<Button
				sizes="small"
				colors="grayBorder"
				className="w-auto px-3"
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
				H2
			</Button>
		</div>
	);
}
