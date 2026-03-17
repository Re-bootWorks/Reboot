import { Button } from "@headlessui/react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { IcKakao, IcGoogle } from "../../icons";

const socialButtonVariants = cva(
	"flex cursor-pointer items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-base font-semibold",
	{
		variants: {
			social: {
				Kakao: "bg-[#FEE500] text-[#000000]/85",
				Google: "border border-[#747775] bg-white text-[#1F1F1F] py-[0.6875rem]",
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
