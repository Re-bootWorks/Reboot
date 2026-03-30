import Image from "next/image";
import { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface EmptyProps {
	section?: boolean;
	className?: string;
	children: ReactNode;
}
const pageStyle = "h-full justify-center";
const sectionStyle = "rounded-4xl bg-white ";
export default function Empty({ section = false, className, children }: EmptyProps) {
	return (
		<section
			className={cn(
				"flex flex-col px-6 py-10 md:py-14",
				section ? sectionStyle : pageStyle,
				className,
			)}>
			<div>
				<Image
					src="/assets/img/img_empty.svg"
					alt="컨텐츠가 없습니다."
					width={120}
					height={72}
					className="mx-auto"
				/>
				<div className="mt-5 text-center text-sm text-gray-500 md:mt-6 md:text-base">
					{children}
				</div>
			</div>
		</section>
	);
}
