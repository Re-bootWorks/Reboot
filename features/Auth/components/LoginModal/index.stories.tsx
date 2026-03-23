import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LoginModal } from ".";
import { useModalStore } from "@/store/modal.store";
import { ToastProvider } from "@/providers/toast-provider";

const meta: Meta<typeof LoginModal> = {
	title: "Features/auth/LoginModal",
	component: LoginModal,
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
type Story = StoryObj<typeof LoginModal>;

function LoginModalWrapper() {
	const { openLogin } = useModalStore();
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<button
				onClick={openLogin}
				className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700">
				로그인 모달 열기
			</button>
			<LoginModal />
		</div>
	);
}

export const Default: Story = {
	render: () => <LoginModalWrapper />,
};
