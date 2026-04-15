import { Metadata } from "next";

export const metadata: Metadata = {
	title: "로그인",
	robots: {
		index: false,
		follow: true,
	},
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
