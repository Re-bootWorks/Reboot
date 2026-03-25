export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-[calc(100vh-48px)] min-h-[calc(100vh-88px)] flex-col items-center justify-center bg-gray-50">
			{children}
		</div>
	);
}
