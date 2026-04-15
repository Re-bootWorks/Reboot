import Container from "@/components/layout/Container";
import ScrollTopButton from "@/components/ui/Buttons/ScrollTopButton";

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
	return (
		<Container as="main" className="pb-10">
			{children}
			<ScrollTopButton />
		</Container>
	);
}
