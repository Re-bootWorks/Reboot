import Image from "next/image";

interface ProblemCardProps {
	title: string;
	description: string;
	image: string;
	alt: string;
}

export default function ProblemCard({ title, description, image, alt }: ProblemCardProps) {
	return (
		<article className="flex min-w-86.5 flex-col items-center justify-center gap-6 rounded-3xl bg-white/70 p-6 text-center shadow-[0_0_16px_0_rgba(255,135,66,0.2)] md:w-86.5 md:p-8">
			<h3 className="text-base font-semibold whitespace-pre-line text-gray-900 md:text-xl">
				{title}
			</h3>
			<div className="flex size-25 items-center justify-center rounded-full bg-orange-100 md:size-37.5">
				<Image src={image} alt={alt} width={524} height={660} className="size-17 md:size-25" />
			</div>

			<p className="text-sm whitespace-pre-line text-gray-600 md:text-base">{description}</p>
		</article>
	);
}
