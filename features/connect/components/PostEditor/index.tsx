"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "@/features/connect/components/PostEditor/Toolbar";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { useEffect } from "react";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import { useToast } from "@/providers/toast-provider";

interface Props {
	content: string;
	onChange: (content: string) => void;
}

export default function PostEditor({ content, onChange }: Props) {
	const { handleShowToast } = useToast();
	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit,
			BulletList.configure({
				HTMLAttributes: {
					class: "list-disc pl-5",
				},
			}),
			ListItem,
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
					"max-w-none min-h-[200px] outline-none p-4 [&_img]:max-w-[200px] [&_img]:w-full [&_img]:rounded-[40px] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
			},
		},
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});
	useEffect(() => {
		if (editor && content && !editor.isFocused) {
			editor.commands.setContent(content);
		}
	}, [editor, content]);

	if (!editor) return null;

	return (
		<div className="overflow-hidden bg-white px-2">
			<Toolbar
				editor={editor}
				onError={(message) => handleShowToast({ message, status: "error" })}
			/>

			<div className="mt-6">
				<EditorContent editor={editor} className="min-h-[518px]" />
			</div>
		</div>
	);
}
