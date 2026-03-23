"use client";

import { useState } from "react";
import { REGION_DATA } from "@/constants/region";
import RegionTrigger from "./RegionTrigger";
import IcDelete from "@/components/ui/icons/IcDelete";
import IcCheck from "@/components/ui/icons/IcCheck";
import { cn } from "@/utils/cn";

interface RegionModalProps {
	isOpen: boolean; // 모달 열림 상태
	onClose: () => void; // 모달 닫기
	onConfirm: (region: string, district: string) => void; // 선택값 전달
}

export default function RegionModal({ isOpen, onClose, onConfirm }: RegionModalProps) {
	// 상태
	const [openRegion, setOpenRegion] = useState<string | null>(null); // 펼쳐진 시/도
	const [selectedRegion, setSelectedRegion] = useState(""); // 선택된 시/도
	const [selectedDistrict, setSelectedDistrict] = useState(""); // 선택된 구/군

	// 선택값 → UI 라벨 변환
	const getSelectedLabel = () => {
		if (!selectedRegion) return "지역 전체";

		const region = REGION_DATA.find((r) => r.value === selectedRegion);
		if (!region) return "지역 전체";

		if (!selectedDistrict) return region.label;

		const district = region.districts.find((d) => d.value === selectedDistrict);

		return district?.label ?? region.label;
	};

	if (!isOpen) return null;

	const isAllSelected = !selectedRegion && !selectedDistrict; // 전체 선택 여부

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="flex h-[35.75rem] w-[21.375rem] flex-col rounded-3xl bg-white px-6 pt-8 pb-6 md:h-[724px] md:w-[544px] md:rounded-2xl md:p-12">
				{/* 헤더 */}
				<div className="mb-8 flex h-7 w-[18.375rem] items-center justify-between md:mb-12 md:h-8 md:w-[28rem]">
					<h2 className="text-lg leading-7 font-semibold tracking-[-0.36px] md:text-2xl md:leading-8 md:tracking-[-0.48px]">
						지역 선택
					</h2>

					<button onClick={onClose} className="flex items-center justify-center">
						<IcDelete />
					</button>
				</div>

				{/* 선택 리스트 */}
				<div className="flex flex-1 flex-col gap-4 overflow-y-auto">
					{/* 지역 전체 */}
					<button
						onClick={() => {
							setSelectedRegion("");
							setSelectedDistrict("");
							setOpenRegion(null);
						}}
						className={cn(
							"flex h-[2.5rem] min-h-[2.5rem] w-full items-center justify-between gap-1.5 rounded-xl bg-gray-50 px-4 text-sm text-gray-800 transition-colors",
							isAllSelected ? "border border-purple-500" : "border border-gray-50",
						)}>
						<span>지역 전체</span>
						{isAllSelected && <IcCheck />}
					</button>

					{/* 시/도 리스트 */}
					{REGION_DATA.map((region) => {
						const isOpen = openRegion === region.value;

						return (
							<div key={region.value} className="relative">
								{/* 시/도 버튼 */}
								<RegionTrigger
									label={region.label}
									isOpen={isOpen}
									onToggle={() => setOpenRegion(isOpen ? null : region.value)}
								/>

								{/* 구/군 드롭다운 */}
								{isOpen && (
									<div className="absolute top-full left-0 z-20 mt-2 max-h-60 w-full origin-top overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
										{/* 구/군 리스트 */}
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
														"flex h-[2.75rem] w-full items-center justify-between rounded-lg px-3 text-sm",
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

				{/* 하단 버튼 */}
				<div className="mt-8 flex gap-2.5 md:mt-[3.5rem] md:gap-4">
					<button
						onClick={onClose}
						className="flex h-[3.75rem] flex-1 items-center justify-center rounded-2xl border border-gray-200 px-[1.875rem] md:py-4">
						취소
					</button>

					<button
						onClick={() => {
							onConfirm(selectedRegion, selectedDistrict);
							onClose();
						}}
						className="flex h-[3.75rem] flex-1 items-center justify-center rounded-2xl bg-purple-500 px-[1.875rem] text-white md:py-4">
						확인
					</button>
				</div>
			</div>
		</div>
	);
}
