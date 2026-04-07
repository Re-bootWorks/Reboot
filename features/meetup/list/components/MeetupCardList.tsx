"use client";

import MeetupCardItems from "./MeetupCardItems";

const size = 10;

export default function MeetupCardList() {
	return (
		<ul className="grid w-full content-start justify-items-stretch gap-4 md:gap-6 lg:grid-cols-2">
			<MeetupCardItems size={size} />
		</ul>
	);
}
