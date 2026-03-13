"use client";

import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import { cn } from "@/utils/cn";
type FilterDropdownProps = {
	label: string;
	options: string[];
	value: string; // 제어 컴포넌트: 부모가 현재 선택값을 전달
	onChange: (value: string) => void; //  필수: 선택 변경 시 부모에게 알림
};

export function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
	//  상태 제거! 부모가 관리하므로 내부 상태 불필요

	//  handleChange도 단순화: 부모에게 알리기만 함
	const handleChange = (newValue: string) => {
		onChange(newValue); // 부모의 setState 호출
	};

	//  현재 선택값이 label과 다르면 활성화 상태
	const isActive = value !== label;

	// label을 options에 자동 포함 (중복 제거)
	// 예: label="날짜 전체", options=["오늘", "이번 주"]
	// → allOptions = ["날짜 전체", "오늘", "이번 주"]
	const allOptions = [label, ...options.filter((opt) => opt !== label)];

	return (
		<Listbox value={value} onChange={handleChange}>
			<div className="relative inline-block">
				{/* 버튼 */}
				<ListboxButton
					className={cn(
						"flex items-center gap-2 rounded-lg px-4 py-2",
						"text-sm font-medium transition-all",
						isActive ? "bg-gray-100 text-gray-900" : "bg-white text-gray-600 hover:bg-gray-50",
					)}>
					{value}
					<svg
						className={cn("h-4 w-4 transition-transform", isActive && "rotate-180")}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
					</svg>
				</ListboxButton>

				<ListboxOptions
					className={cn(
						"absolute left-0 mt-2",
						"w-max min-w-full",
						"rounded-lg bg-white shadow-lg",
						"border border-gray-100",
						"py-1",
						"focus:outline-none",
						"overflow-hidden",
						"z-10",
					)}>
					{allOptions.map((option) => (
						<ListboxOption
							key={option}
							value={option}
							className={({ active, selected }) =>
								cn(
									"cursor-pointer px-4 py-2 text-sm transition-colors",
									active && "bg-gray-50",
									selected ? "font-medium text-gray-900" : "text-gray-600",
								)
							}>
							{option}
						</ListboxOption>
					))}
				</ListboxOptions>
			</div>
		</Listbox>
	);
}
