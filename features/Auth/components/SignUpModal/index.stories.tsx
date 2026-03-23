import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SignUpModal } from ".";
import { useModalStore } from "@/store/modal.store";
import { ToastProvider } from "@/providers/toast-provider";

const meta: Meta<typeof SignUpModal> = {
	title: "Ui/Modal/SignUpModal",
	component: SignUpModal,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
	decorators: [
		(Story) => (
			<ToastProvider>
				<Story />
			</ToastProvider>
		),
	],
};

export default meta;
type Story = StoryObj<typeof SignUpModal>;

function SignUpModalWrapper() {
	const { openSignup } = useModalStore();
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<button
				onClick={openSignup}
				className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700">
				회원가입 모달 열기
			</button>
			<SignUpModal />
		</div>
	);
}

export const Default: Story = {
	render: () => <SignUpModalWrapper />,
};
