import { Button } from "@headlessui/react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { IcKakao, IcGoogle } from "../../icons";

const socialButtonVariants = cva(
	"flex cursor-pointer items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-base font-semibold",
	{
		variants: {
			social: {
				Kakao: "bg-kakao-bg text-kakao-text",
				Google: "border-google-border text-google-text border bg-white py-[0.6875rem]",
			},
		},
	},
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	social: "Kakao" | "Google";
	className?: string;
	children?: React.ReactNode;
};

const SOCIAL_ICON = {
	Kakao: <IcKakao />,
	Google: <IcGoogle />,
};

export default function SocialButton({ children, social, className, ...props }: ButtonProps) {
	return (
		<Button
			className={cn(socialButtonVariants({ social }), "w-full md:w-55.5", className)}
			{...props}>
			{SOCIAL_ICON[social]}
			{children}
		</Button>
	);
}
