"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import IcChevronDown from "@/components/ui/icons/IcChevronDown";
import RegionModal from "./RegionModal";
import { REGION_DATA } from "@/constants/region";
import Button from "../../Buttons/Button";
interface RegionButtonProps {
	value: {
		region: string;
		district: string;
	};
	onChange: (region: string, district: string) => void;
	className?: string;
}

export default function RegionFilter({ value, onChange, className }: RegionButtonProps) {
	const [isOpen, setIsOpen] = useState(false);

	const getLabel = () => {
		const { region, district } = value;

		if (!region) return "지역 전체";

		const foundRegion = REGION_DATA.find((r) => r.value === region);
		if (!foundRegion) return "지역 전체";

		if (!district) return foundRegion.label;

		const foundDistrict = foundRegion.districts.find((d) => d.value === district);

		return foundDistrict?.label ?? foundRegion.label;
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
				onConfirm={(region, district) => {
					onChange(region, district);
				}}
				initialRegion={value.region}
				initialDistrict={value.district}
			/>
		</>
	);
}
