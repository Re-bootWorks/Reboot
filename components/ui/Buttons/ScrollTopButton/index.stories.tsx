import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useRef } from "react";
import ScrollTopButton from "./index";

const meta: Meta<typeof ScrollTopButton> = {
	title: "Buttons/ScrollTopButton",
	component: ScrollTopButton,
	tags: ["autodocs"],
	parameters: {
		layout: "centered",
	},
};

export default meta;

type Story = StoryObj<typeof ScrollTopButton>;

export const Default: Story = {
	render: () => (
		<div className="p-20">
			<ScrollTopButton />
		</div>
	),
};

export const InsideScrollableContainer: Story = {
	render: () => {
		const contentRef = useRef<HTMLDivElement>(null);

		return (
			<div className="relative w-90">
				<div ref={contentRef} className="scrollbar h-50">
					{Array.from({ length: 10 }).map((_, index) => (
						<div key={index} className="mb-4 bg-gray-50 p-4 text-sm text-gray-700">
							스크롤 테스트용 콘텐츠 {index + 1}
						</div>
					))}
				</div>
				<div className="absolute right-4 bottom-4">
					<ScrollTopButton threshold={80} targetRef={contentRef} />
				</div>
			</div>
		);
	},
};
