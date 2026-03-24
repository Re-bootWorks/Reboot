"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import IcChevronDown from "@/components/ui/icons/IcChevronDown";
import RegionModal from "./RegionModal";
import { REGION_DATA } from "@/constants/region";

interface RegionButtonProps {
	className?: string;
}

export default function RegionFilter({ className }: RegionButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedRegion, setSelectedRegion] = useState("");
	const [selectedDistrict, setSelectedDistrict] = useState("");

	const getLabel = () => {
		if (!selectedRegion) return "지역 전체";

		const region = REGION_DATA.find((r) => r.value === selectedRegion);
		if (!region) return "지역 전체";

		if (!selectedDistrict) return region.label;

		const district = region.districts.find((d) => d.value === selectedDistrict);

		return district?.label ?? region.label;
	};

	return (
		<>
			{/* 버튼 */}
			<button
				onClick={() => setIsOpen(true)}
				className={cn(
					"flex items-center gap-1",
					"rounded-b-md px-3 py-1.5",
					"bg-white",
					"text-base font-medium tracking-[-0.02rem]",
					"cursor-pointer",
					selectedRegion || selectedDistrict ? "text-gray-700" : "text-gray-600",
					className,
				)}>
				{getLabel()}
				<IcChevronDown color="currentColor" />
			</button>

			{/* 모달 */}
			<RegionModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				onConfirm={(region, district) => {
					setSelectedRegion(region);
					setSelectedDistrict(district);
				}}
				initialRegion={selectedRegion}
				initialDistrict={selectedDistrict}
			/>
		</>
	);
}
