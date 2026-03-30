"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "@/features/connect/components/PostEditor/Toolbar";
interface Props {
	content: string;
	onChange: (content: string) => void;
}

export default function PostEditor({ content, onChange }: Props) {
	const editor = useEditor({
		extensions: [StarterKit],
		content,
		editorProps: {
			attributes: {
				class: "prose max-w-none min-h-[200px] outline-none p-4",
			},
		},
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	if (!editor) return null;

	return (
		<div className="overflow-hidden rounded-xl border bg-white">
			<Toolbar editor={editor} />

			<EditorContent editor={editor} />
		</div>
	);
}
