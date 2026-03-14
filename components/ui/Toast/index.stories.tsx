import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ToastBox } from ".";
import { ToastProvider, useToast } from "@/providers/toast-provider";

function ToastTestingButtons() {
	const { handleShowToast } = useToast();

	return (
		<div className="flex flex-wrap gap-3">
			<button
				type="button"
				className="rounded-md bg-gray-700 p-3 text-white"
				onClick={() =>
					handleShowToast({
						message: "기본 상태 토스트입니다.",
						duration: 5000,
					})
				}>
				Default
			</button>
			<button
				type="button"
				className="rounded-md bg-green-500 p-3 text-white"
				onClick={() =>
					handleShowToast({
						message: "업로드가 완료되었습니다.",
						status: "success",
					})
				}>
				Success
			</button>
			<button
				type="button"
				className="rounded-md bg-red-500 p-3 text-white"
				onClick={() =>
					handleShowToast({
						message: "이미지는 최대 2장까지 업로드할 수 있습니다.",
						status: "error",
					})
				}>
				Error
			</button>
		</div>
	);
}

const meta: Meta<typeof ToastBox> = {
	title: "UI/Toast",
	component: ToastBox,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component: "유저에게 피드백을 전달하는 Toast 컴포넌트",
			},
		},
	},
	argTypes: {
		status: {
			control: { type: "radio" },
			options: ["success", "error", undefined],
		},
	},
};
export default meta;

type Story = StoryObj<typeof ToastBox>;

export const Default: Story = {
	parameters: {
		docs: {
			description: {
				story: "success / error 외의 경우에 사용합니다. (info)",
			},
		},
	},
	args: {
		children: "아직 모임이 없어요",
	},
};

export const Success: Story = {
	args: {
		status: "success",
		children: "업로드가 완료되었습니다.",
	},
};

export const Error: Story = {
	args: {
		status: "error",
		children: "업로드에 실패했습니다.",
	},
};

export const Handler: Story = {
	parameters: {
		docs: {
			description: {
				story: "`useToast` 훅으로 실제 토스트를 호출하는 스토리입니다.",
			},
			source: {
				code: `// 기본 토스트
handleShowToast({
  message: "기본 토스트 입니다.",
  duration: 5000, // 기본값이 3000ms 이므로 수정이 필요한 경우에만 사용 
});
handleShowToast({
  message: "업로드가 완료되었습니다.",
  status: "success",
});
handleShowToast({
  message: "이미지는 최대 2장까지 업로드할 수 있습니다.",
  status: "error",
});`,
			},
			language: "tsx",
			excludeDecorators: true,
		},
	},
	decorators: [
		(Story) => (
			<ToastProvider>
				<Story />
			</ToastProvider>
		),
	],
	render: () => <ToastTestingButtons />,
};
