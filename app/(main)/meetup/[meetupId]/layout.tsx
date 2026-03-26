import Container from "@/components/layout/Container";

export default function MeetupDetailLayout({ children }: { children: React.ReactNode }) {
	return (
		<Container className="flex flex-col items-center gap-10 py-10 md:py-16 lg:py-20">
			{children}
		</Container>
	);
}
