import { ReactNode } from "react";

interface AuthFormContainerProps {
	title: string;
	footer: ReactNode;
	children: ReactNode;
}

export default function AuthFormContainer({ title, footer, children }: AuthFormContainerProps) {
	return (
		<div className="w-full max-w-[343px] rounded-3xl bg-white p-6 shadow-xl md:max-w-142 md:px-14 md:pt-12 md:pb-11">
			<h2 className="mb-8 text-center text-2xl font-semibold text-gray-900 md:mb-12">{title}</h2>
			{children}
			<p className="mt-8 text-center text-sm font-medium text-gray-800">{footer}</p>
		</div>
	);
}
