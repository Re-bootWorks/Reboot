import Container from "@/components/layout/Container";
import ScrollTopButton from "@/components/ui/Buttons/ScrollTopButton";

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
	return (
		<Container as="main">
			{children} <ScrollTopButton />
		</Container>
	);
}
