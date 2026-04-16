import { Metadata } from "next";
import Container from "@/components/layout/Container";
import { CreateFormView } from "@/features/meetup/create";
import BackgroundMeetups from "@/features/meetup/create/components/BackgroundMeetups";
import { cn } from "@/utils/cn";

export const metadata: Metadata = {
	title: "모임 만들기",
	robots: {
		index: false,
		follow: false,
	},
};

// 직접 접근 방식으로 /meetup/create 진입 시
export default function MeetUpCreatePage() {
	return (
		<Container className="flex h-[calc(100vh-48px)] p-4 md:h-[calc(100vh-88px)] md:p-6">
			<div
				className={cn(
					"relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-3xl",
					"md:flex-row md:rounded-none",
				)}>
				<BackgroundMeetups className="absolute md:relative md:flex-1 md:rounded-tl-xl md:rounded-r-none lg:flex-2" />
				<div
					className={cn(
						"relative flex w-full flex-2 flex-col items-center justify-center overflow-y-auto p-4",
						"md:h-full md:overflow-visible md:rounded-r-xl md:bg-white md:p-12",
					)}>
					<CreateFormView />
				</div>
			</div>
		</Container>
	);
}
