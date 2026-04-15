import { Metadata } from "next";
import MeetUpCreate from "@/features/meetup/create";

export const metadata: Metadata = {
	title: "모임 만들기",
	robots: {
		index: false,
		follow: false,
	},
};

// Link 또는 router로 /meetup/create 진입 시
export default function MeetupCreateInterceptPage() {
	return <MeetUpCreate />;
}
