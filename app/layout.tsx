import { ToastProvider } from "@/providers/toast-provider";
import "../styles/globals.css";
import localFont from "next/font/local";
import Header from "@/components/layout/Header";

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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko">
			<body className={pretendard.className}>
				<ToastProvider>
					<Header />
					{children}
				</ToastProvider>
			</body>
		</html>
	);
}
