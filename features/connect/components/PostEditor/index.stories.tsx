import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PostEditor from "./index";
import { useState } from "react";

const meta: Meta<typeof PostEditor> = {
	title: "Connect/PostEditor",
	component: PostEditor,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof PostEditor>;

export const Default: Story = {
	render: () => {
		const [content, setContent] = useState("");

		return (
			<div className="w-[600px]">
				<PostEditor content={content} onChange={setContent} />
			</div>
		);
	},
};
