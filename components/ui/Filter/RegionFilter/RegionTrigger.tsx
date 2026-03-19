"use client";

import IcArrowDown from "@/components/ui/icons/IcArrowDown";
import { cn } from "@/utils/cn";

interface RegionTriggerProps {
	label: string; //버튼에 보여줄 텍스트 예)강남구
	isOpen: boolean; //모달 열림 상태
	onToggle: () => void; //클릭했을 때 실행되는 함수
}

export default function RegionTrigger({ label, isOpen, onToggle }: RegionTriggerProps) {
	return (
		<button
			onClick={onToggle}
			className={cn(
				"flex h-10 w-full items-center justify-between rounded-xl border bg-gray-50 px-3 text-sm text-gray-800 transition-colors md:h-12 md:text-base",
				isOpen ? "border-purple-500" : "border-gray-50",
			)}>
			<span>{label}</span>

			<IcArrowDown
				className={cn(
					"size-4.5 shrink-0 transition-transform duration-200 md:size-6",
					isOpen && "rotate-180",
				)}
			/>
		</button>
	);
}
