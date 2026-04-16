"use client";

import { Metadata } from "next";
import { usePathname } from "next/navigation";
import { MEETUP_CREATE_PATH } from "@/constants/navigation";
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
	const pathname = usePathname();

	// 같은 수준의 다른 페이지에서 표시되는 이슈 수정
	// window.location.href, pathname 또는 params, proxy 등으로 해결
	// https://github.com/vercel/next.js/pull/92310
	if (pathname !== MEETUP_CREATE_PATH) {
		return null;
	}

	return <MeetUpCreate />;
}
