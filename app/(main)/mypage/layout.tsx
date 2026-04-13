import Container from "@/components/layout/Container";
import ScrollTopButton from "@/components/ui/Buttons/ScrollTopButton";

export default function MyLayout({ children }: { children: React.ReactNode }) {
	return (
		<Container className="relative flex flex-col gap-8 py-6 md:gap-10 md:py-8 lg:flex-row">
			{children}
			<ScrollTopButton />
		</Container>
	);
}
