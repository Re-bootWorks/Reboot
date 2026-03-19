"use client";

import { useState } from "react";
import { REGION_DATA } from "@/constants/region";
import RegionTrigger from "./RegionTrigger";
import IcDelete from "@/components/ui/icons/IcDelete";
import IcCheck from "@/components/ui/icons/IcCheck";
import { cn } from "@/utils/cn";

interface RegionModalProps {
	isOpen: boolean; //모달 열림 상태
	onClose: () => void; //모달 닫기
	onConfirm: (region: string, district: string) => void; //onConfirm(지역, 구)
}

export default function RegionModal({ isOpen, onClose, onConfirm }: RegionModalProps) {
	const [openRegion, setOpenRegion] = useState<string | null>(null);
	const [selectedRegion, setSelectedRegion] = useState("");
	const [selectedDistrict, setSelectedDistrict] = useState("");

	const getSelectedLabel = () => {
		if (!selectedRegion) return "지역 전체";

		const region = REGION_DATA.find((r) => r.value === selectedRegion);
		if (!region) return "지역 전체";

		if (!selectedDistrict) return region.label;

		const district = region.districts.find((d) => d.value === selectedDistrict);

		return district?.label ?? region.label;
	};

	if (!isOpen) return null;

	const isAllSelected = !selectedRegion && !selectedDistrict;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="flex h-[724px] w-[544px] flex-col rounded-2xl bg-white p-6">
				<div className="mb-6 flex items-center justify-between">
					<h2 className="text-lg font-semibold">지역 선택</h2>
					<button onClick={onClose}>
						<IcDelete />
					</button>
				</div>
				<div className="flex flex-1 flex-col gap-3 overflow-y-auto">
					{/* 지역 전체 */}
					<button
						onClick={() => {
							setSelectedRegion("");
							setSelectedDistrict("");
							setOpenRegion(null);
						}}
						className={cn(
							"flex w-full items-center justify-between gap-2.5 rounded-xl bg-gray-50 px-3 py-3 text-sm text-gray-800 transition-colors md:text-base",
							isAllSelected ? "border border-purple-500" : "border border-gray-50",
						)}>
						<span>지역 전체</span>
						{isAllSelected && <IcCheck />}
					</button>

					{/* 시/도 */}
					{REGION_DATA.map((region) => {
						const isOpen = openRegion === region.value;

						return (
							<div key={region.value} className="relative">
								<RegionTrigger
									label={region.label}
									isOpen={isOpen}
									onToggle={() => setOpenRegion(isOpen ? null : region.value)}
								/>

								{/* dropdown */}
								{isOpen && (
									<div className="absolute top-full left-0 z-20 mt-2 max-h-60 w-full origin-top overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl transition duration-150 ease-out">
										{region.districts.map((district) => {
											const isSelected = selectedDistrict === district.value;

											return (
												<button
													key={district.value}
													onClick={() => {
														setSelectedRegion(region.value);
														setSelectedDistrict(district.value);
														setOpenRegion(null);
													}}
													className={cn(
														"flex h-9 w-full items-center justify-between rounded-lg px-3 text-sm transition-colors md:text-base",
														isSelected
															? "bg-purple-200 font-semibold text-purple-600"
															: "text-gray-800 hover:bg-gray-50",
													)}>
													<span>{district.label}</span>
													{isSelected && <IcCheck />}
												</button>
											);
										})}
									</div>
								)}
							</div>
						);
					})}
				</div>

				{/* 버튼 */}
				<div className="mt-6 flex gap-3">
					<button onClick={onClose} className="h-12 flex-1 rounded-xl border border-gray-200">
						취소
					</button>

					<button
						onClick={() => {
							onConfirm(selectedRegion, selectedDistrict);
							onClose();
						}}
						className="h-12 flex-1 rounded-xl bg-purple-500 text-white">
						확인
					</button>
				</div>
			</div>
		</div>
	);
}
