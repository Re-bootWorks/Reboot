import Container from "@/components/layout/Container";

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
	return (
		<Container as="main" className="pb-10">
			{children}
		</Container>
	);
}
