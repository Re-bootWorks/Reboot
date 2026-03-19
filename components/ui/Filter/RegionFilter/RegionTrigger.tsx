"use client";

import IcArrowDown from "@/components/ui/icons/IcArrowDown";

interface RegionTriggerProps {
	label: string;
	isOpen: boolean;
	onToggle: () => void;
}

export default function RegionTrigger({ label, isOpen, onToggle }: RegionTriggerProps) {
	return (
		<button
			onClick={onToggle}
			className={`flex h-10 w-full items-center justify-between rounded-xl border px-3 md:h-12 ${isOpen ? "border-purple-500" : "border-gray-50"} bg-gray-50 text-sm text-gray-800 transition-colors md:text-base`}>
			<span>{label}</span>

			<IcArrowDown
				className={`size-4.5 shrink-0 transition-transform duration-200 md:size-6 ${isOpen ? "rotate-180" : ""} `}
			/>
		</button>
	);
}
