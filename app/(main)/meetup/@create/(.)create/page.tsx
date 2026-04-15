"use client";

import { usePathname } from "next/navigation";
import MeetUpCreate from "@/features/meetup/create";

const MEETUP_CREATE_PATH = "/meetup/create";

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
