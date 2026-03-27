export default function MeetupLayout({
	children,
	create,
	// 다른 모달 추가
}: {
	children: React.ReactNode;
	create: React.ReactNode;
}) {
	return (
		<>
			{children}
			{create}
		</>
	);
}
