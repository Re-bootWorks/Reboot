"use client";

import dynamic from "next/dynamic";

const TabWrapper = dynamic(() => import("./TabWrapper"), {
	ssr: false,
});

export default function MyTab() {
	return <TabWrapper />;
}
