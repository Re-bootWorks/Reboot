import Container from "@/components/layout/Container";
import ScrollTopButton from "@/components/ui/Buttons/ScrollTopButton";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "모든 리뷰",
	description: "전체 모임에 대한 모든 리뷰들을 볼 수 있습니다.",
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
	return (
		<Container as="main" className="pb-10">
			{children}
			<ScrollTopButton />
		</Container>
	);
}
