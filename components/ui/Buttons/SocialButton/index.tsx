import { Button } from "@headlessui/react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { IcKakao, IcGoogle } from "../../icons";

const socialButtonVariants = cva(
	"font-pretendard flex w-[222px] cursor-pointer items-center justify-center gap-2.5 rounded-xl px-3 py-4 text-base font-semibold text-gray-800",
	{
		variants: {
			social: {
				Kakao: "bg-[#FFEE01]",
				Google: "border border-gray-200 bg-white",
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
		<Button className={cn(socialButtonVariants({ social }), className)} {...props}>
			{SOCIAL_ICON[social]}
			{children}
		</Button>
	);
}
