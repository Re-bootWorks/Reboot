import Container from "@/components/layout/Container";
import ScrollTopButton from "@/components/ui/Buttons/ScrollTopButton";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "찜한 목록",
	description: "찜한 모임 목록을 볼 수 있습니다.",
	robots: {
		index: false,
		follow: false,
	},
};

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
	return (
		<Container as="main">
			{children} <ScrollTopButton />
		</Container>
	);
}
