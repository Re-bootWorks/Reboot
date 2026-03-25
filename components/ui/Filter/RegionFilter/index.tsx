"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import IcChevronDown from "@/components/ui/icons/IcChevronDown";
import RegionModal from "./RegionModal";
import { REGION_DATA } from "@/constants/region";
import Button from "../../Buttons/Button";
import { Option } from "./option";

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
			<Button
				onClick={() => setIsOpen(true)}
				sizes="small"
				colors="grayBorder"
				className={cn(
					"w-auto justify-start gap-1",
					"rounded-b-md",
					"border-none",
					value.region || value.district ? "text-gray-700" : "text-gray-600",
					className,
				)}>
				{getLabel()}
				<IcChevronDown color="currentColor" />
			</Button>

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
