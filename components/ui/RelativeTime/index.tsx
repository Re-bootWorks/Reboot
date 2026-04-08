"use client";

import { useEffect, useState } from "react";
import dayjs from "@/libs/dayjs";

type RelativeTimeProps = {
	date: string | number | Date;
	fallback?: "date" | "time" | "none";
	className?: string;
};

export default function RelativeTime({ date, fallback = "date", className }: RelativeTimeProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		if (fallback === "date") {
			return <span className={className}>{dayjs(date).format("YYYY.MM.DD")}</span>;
		}

		if (fallback === "time") {
			return <span className={className}>{dayjs(date).format("HH:mm")}</span>;
		}

		return <span className={className} />;
	}

	return <span className={className}>{dayjs(date).fromNow()}</span>;
}
