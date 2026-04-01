"use client";

import { Modal } from "@/components/ui/Modals";
import { useModalStore } from "@/store/modal.store";
import { SignUpForm } from "./SignUpForm";

interface SignUpModalProps {
	hideCloseButton?: boolean;
}

export function SignUpModal({ hideCloseButton }: SignUpModalProps) {
	const { signupOpen, closeSignup, openLogin } = useModalStore();

	return (
		<Modal
			isOpen={signupOpen}
			onClose={closeSignup}
			title="회원가입"
			isCenterTitle={true}
			hideCloseButton={hideCloseButton}
			footer={
				<div className="flex justify-center gap-1">
					<span>이미 회원이신가요?</span>
					<button
						onClick={() => {
							closeSignup();
							openLogin();
						}}
						className="cursor-pointer text-sm font-semibold text-purple-600 underline md:text-[15px] md:leading-normal md:font-medium">
						로그인
					</button>
				</div>
			}
			footerClassName="md:pt-10 text-center text-sm font-medium text-gray-800 md:text-[15px] md:leading-normal"
			className="max-h-[90vh] max-w-[343px] p-6 md:max-w-142 md:px-14 md:py-10">
			<SignUpForm
				onSuccess={closeSignup}
				onAutoLoginFail={() => {
					closeSignup();
					openLogin();
				}}
			/>
		</Modal>
	);
}
