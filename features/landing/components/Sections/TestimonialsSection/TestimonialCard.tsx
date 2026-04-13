import Avatar from "@/components/ui/Avatar";
import { RATING_STYLE } from "@/constants/ratingStyle";
import { Rating } from "@smastrom/react-rating";

interface TestimonialCardProps {
	name: string;
	date: string;
	content: string;
	rating?: number;
	profileImage?: string;
	className?: string;
}

export default function TestimonialCard({
	name,
	date,
	content,
	rating = 5,
	profileImage = "/assets/img/img_profile_default.svg",
	className = "",
}: TestimonialCardProps) {
	return (
		<article
			className={`rounded-3xl bg-white px-6 py-4 shadow-[0_4px_16px_0_rgba(0,0,0,0.04)] md:w-131 lg:w-[25rem] ${className}`}>
			<div className="flex h-13.5 w-full items-start gap-3">
				<Avatar width={54} height={54} src={profileImage} alt={`${name}님의 프로필 이미지`} />

				<div className="flex h-full flex-col justify-between">
					<div className="flex w-31 flex-wrap items-center gap-2">
						<Rating value={rating} readOnly itemStyles={RATING_STYLE} />
					</div>

					<div className="flex gap-2 text-sm text-gray-500">
						<span className="font-medium">{name}</span>
						<span className="font-normal">{date}</span>
					</div>
				</div>
			</div>

			<p className="mt-7 w-full text-lg break-keep text-gray-700">{content}</p>
		</article>
	);
}
