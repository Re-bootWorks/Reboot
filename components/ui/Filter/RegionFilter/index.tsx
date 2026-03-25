"use client";

import { useState } from "react";
import IcChevronDown from "@/components/ui/icons/IcChevronDown";
import RegionModal from "./RegionModal";
import { Option } from "./option";
import FilterTrigger from "@/components/ui/Filter/FilterTrigger";

interface RegionButtonProps {
	value: {
		region: Option | null;
		district: Option | null;
	};
	onChange: (data: { region: Option | null; district: Option | null; fullLabel: string }) => void;
	className?: string;
}

export default function RegionFilter({ value, onChange, className }: RegionButtonProps) {
	const [isOpen, setIsOpen] = useState(false);

	const getLabel = () => {
		const { region, district } = value;

		if (!region) return "지역 전체";
		if (!district) return region.label;
		return `${region.label} ${district.label}`;
	};

	return (
		<>
			{/* 버튼 */}
			<FilterTrigger
				onClick={() => setIsOpen(true)}
				isActive={!!value.region || !!value.district}
				className={className}>
				{getLabel()}
				<IcChevronDown className="h-4 w-4" />
			</FilterTrigger>

			{/* 모달 */}
			<RegionModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				onConfirm={(data) => {
					onChange(data);
				}}
				initialRegion={value.region}
				initialDistrict={value.district}
			/>
		</>
	);
}
