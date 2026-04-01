export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-[calc(100vh-48px)] flex-col items-center justify-center bg-gray-50 md:min-h-[calc(100vh-88px)]">
			{children}
		</div>
	);
}
