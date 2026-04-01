"use client";

import { Modal } from "@/components/ui/Modals";
import { useModalStore } from "@/store/modal.store";
import { LoginForm } from "./LoginForm";
interface LoginModalProps {
	hideCloseButton?: boolean;
}

export function LoginModal({ hideCloseButton }: LoginModalProps) {
	const { loginOpen, closeLogin, openSignup } = useModalStore();

	return (
		<Modal
			isOpen={loginOpen}
			onClose={closeLogin}
			title="로그인"
			isCenterTitle={true}
			hideCloseButton={hideCloseButton}
			footer={
				<div className="flex justify-center gap-1">
					<span>리부트가 처음이신가요?</span>
					<button
						onClick={() => {
							closeLogin();
							openSignup();
						}}
						className="cursor-pointer text-sm font-semibold text-purple-600 underline md:text-[15px] md:leading-normal md:font-medium">
						회원가입
					</button>
				</div>
			}
			footerClassName="md:pt-10 text-center text-sm font-medium text-gray-800 md:text-[15px] md:leading-normal"
			className="max-h-[90vh] max-w-[343px] px-4 py-6 md:max-w-142 md:px-14 md:pt-12 md:pb-11">
			<LoginForm onSuccess={closeLogin} />
		</Modal>
	);
}
