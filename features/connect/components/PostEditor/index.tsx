"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "@/features/connect/components/PostEditor/Toolbar";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";

interface Props {
	content: string;
	onChange: (content: string) => void;
}

export default function PostEditor({ content, onChange }: Props) {
	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit,
			Underline,
			Image,
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
		],
		content,
		editorProps: {
			attributes: {
				class:
					"max-w-none min-h-[200px] outline-none p-4 [&_img]:max-w-[200px] [&_img]:w-full [&_img]:rounded-[24px]",
			},
		},
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	if (!editor) return null;

	return (
		<div className="overflow-hidden rounded-[24px] bg-white px-2">
			<Toolbar editor={editor} />

			<div className="mt-6">
				<EditorContent editor={editor} className="min-h-[518px]" />
			</div>
		</div>
	);
}
