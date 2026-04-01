import { ToastProvider } from "@/providers/toast-provider";
import "../styles/globals.css";
import localFont from "next/font/local";
import Header from "@/components/layout/Header";
import QueryProvider from "@/providers/query-provider";
import { MemberProvider } from "@/providers/member-provider";
import CategoryInitializer from "@/providers/category-provider";
import { initMeetingTypes } from "@/apis/meetingTypes";
import { Metadata } from "next";

const pretendard = localFont({
	src: "../public/assets/fonts/PretendardVariable.woff2",
	display: "swap",
	weight: "100 900",
	variable: "--font-pretendard",
	fallback: [
		"Pretendard",
		"-apple-system",
		"BlinkMacSystemFont",
		"system-ui",
		"Roboto",
		"Helvetica Neue",
		"Segoe UI",
		"Apple SD Gothic Neo",
		"Noto Sans KR",
		"Malgun Gothic",
		"Apple Color Emoji",
		"Segoe UI Emoji",
		"Segoe UI Symbol",
		"sans-serif",
	],
});

const BASE_URL = "https://reboot-codeit.vercel.app/";

export const metadata: Metadata = {
	metadataBase: new URL(BASE_URL),
	title: {
		default: "RE:BOOT",
		template: "%s | RE:BOOT",
	},
	description: "오늘 당신의 배터리는 몇 %인가요?",
	keywords: ["RE:BOOT", "리부트", "배터리", "번아웃", "자기관리"],

	// Open Graph
	openGraph: {
		type: "website",
		locale: "ko_KR",
		url: BASE_URL,
		siteName: "RE:BOOT",
		title: "RE:BOOT",
		description: "오늘 당신의 배터리는 몇 %인가요?",
		images: [
			{
				url: "/assets/img/og_image.svg",
				width: 1200,
				height: 630,
				alt: "RE:BOOT - 오늘 당신의 배터리는 몇 %인가요?",
			},
		],
	},

	// Twitter / X 카드
	twitter: {
		card: "summary_large_image",
		title: "RE:BOOT",
		description: "오늘 당신의 배터리는 몇 %인가요?",
		images: ["/assets/img/og_image.svg"],
	},

	// 검색엔진 크롤링 허용
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
		},
	},

	// 파비콘 등 아이콘 (선택)
	icons: {
		icon: "/favicon.ico",
		apple: "/assets/img/apple-icon.png",
	},
};
export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const categories = await initMeetingTypes();

	return (
		<html lang="ko">
			<body className={pretendard.className}>
				<CategoryInitializer data={categories} />
				<QueryProvider>
					<ToastProvider>
						<MemberProvider>
							<Header />
							{children}
						</MemberProvider>
					</ToastProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
