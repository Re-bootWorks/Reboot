import { Metadata } from "next";
import CreateInterceptSlot from "@/features/meetup/create/components/CreateInterceptSlot";

export const metadata: Metadata = {
	title: "모임 만들기",
	robots: {
		index: false,
		follow: false,
	},
};

// Link 또는 router로 /meetup/create 진입 시
export default function MeetupCreateInterceptPage() {
	return <CreateInterceptSlot />;
}
