"use client";

import Image from "next/image";
import { cn } from "@/utils/cn";
import styles from "./style.module.css";
import ImgMeetup01 from "@/features/meetup/create/assets/img_meetup_01.svg";
import ImgMeetup02 from "@/features/meetup/create/assets/img_meetup_02.svg";
import ImgMeetup03 from "@/features/meetup/create/assets/img_meetup_03.svg";
import ImgMeetup04 from "@/features/meetup/create/assets/img_meetup_04.svg";
import ImgMeetup05 from "@/features/meetup/create/assets/img_meetup_05.svg";

const MEETUP_IMAGES = [ImgMeetup01, ImgMeetup02, ImgMeetup03, ImgMeetup04, ImgMeetup05] as const;
const directionStyles = {
	left: styles.contentLeft,
	right: styles.contentRight,
};

export default function BackgroundMeetups({ className }: { className?: string }) {
	return (
		<div className={cn("flex h-full w-full flex-col overflow-hidden bg-green-50 py-5", className)}>
			{MEETUP_IMAGES.map((src, index) => (
				<MeetupRow key={index} src={src} direction={index % 2 === 0 ? "left" : "right"} />
			))}
		</div>
	);
}

function MeetupRow({
	src,
	direction,
}: {
	src: (typeof MEETUP_IMAGES)[number];
	direction: "left" | "right";
}) {
	const dirStyle = directionStyles[direction];

	return (
		<div className="h-full min-h-0 w-full min-w-0 overflow-hidden">
			<div className={styles.row}>
				<div className={dirStyle}>
					<Image src={src} alt="" unoptimized className={styles.image} priority />
				</div>
				<div className={dirStyle} aria-hidden="true">
					<Image src={src} alt="" unoptimized className={styles.image} priority />
				</div>
			</div>
		</div>
	);
}
