"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function TextEditor() {
	const editor = useEditor({
		extensions: [StarterKit],
		content: "<p>내용을 입력하세요...</p>",
	});

	return <EditorContent editor={editor} />;
}
