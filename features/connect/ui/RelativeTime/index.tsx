"use client";

import { useEffect, useState } from "react";
import dayjs from "@/libs/dayjs";

type RelativeTimeProps = {
	date: string | number | Date;
	fallback?: "date" | "time" | "none";
};

export default function RelativeTime({ date, fallback = "date" }: RelativeTimeProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		if (fallback === "date") {
			return <span>{dayjs(date).format("YYYY.MM.DD")}</span>;
		}

		if (fallback === "time") {
			return <span>{dayjs(date).format("HH:mm")}</span>;
		}

		return <span />;
	}

	return <span>{dayjs(date).fromNow()}</span>;
}
