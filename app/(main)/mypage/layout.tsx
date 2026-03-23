import Container from "@/components/layout/Container";

export default function MyLayout({ children }: { children: React.ReactNode }) {
	return (
		<Container className="flex flex-col gap-8 py-6 md:gap-10 md:py-8 lg:flex-row lg:py-12">
			{children}
		</Container>
	);
}
