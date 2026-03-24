"use client";

import { useState, useEffect } from "react";
import { REGION_DATA } from "@/constants/region";
import IcDelete from "@/components/ui/icons/IcDelete";
import IcCheck from "@/components/ui/icons/IcCheck";
import { cn } from "@/utils/cn";
import RegionDropdown from "@/components/ui/Dropdowns/RegionDropdown";

interface RegionModalProps {
	isOpen: boolean; // 모달 열림 여부
	onClose: () => void; // 모달 닫기 함수
	onConfirm: (region: string, district: string) => void; // 선택값을 부모로 전달
	initialRegion: string; // 부모에서 전달받은 초기 지역값
	initialDistrict: string; // 부모에서 전달받은 초기 구/군 값
}

export default function RegionModal({
	isOpen,
	onClose,
	onConfirm,
	initialRegion,
	initialDistrict,
}: RegionModalProps) {
	// 모달 내부에서 임시로 관리하는 선택 상태
	const [selectedRegion, setSelectedRegion] = useState(initialRegion);
	const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);

	// 모달이 열릴 때마다 부모의 값을 기준으로 상태 초기화
	useEffect(() => {
		if (isOpen) {
			setSelectedRegion(initialRegion);
			setSelectedDistrict(initialDistrict);
		}
	}, [isOpen, initialRegion, initialDistrict]);

	// 모달이 닫혀있으면 렌더링하지 않음
	if (!isOpen) return null;

	// "지역 전체" 선택 여부 (UI 상태 판단)
	const isAllSelected = !selectedRegion && !selectedDistrict;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="flex h-[35.75rem] w-[21.375rem] flex-col rounded-3xl bg-white px-6 pt-8 pb-6 md:h-[45.25rem] md:w-[34rem] md:rounded-2xl md:p-12">
				{/* 헤더 영역 */}
				<div className="mb-8 flex h-7 w-[18.375rem] items-center justify-between md:mb-12 md:h-8 md:w-[28rem]">
					<h2 className="text-lg font-semibold md:text-2xl">지역 선택</h2>

					{/* 모달 닫기 버튼 */}
					<button onClick={onClose} className="cursor-pointer">
						<IcDelete />
					</button>
				</div>

				{/* 지역 선택 리스트 */}
				<div className="flex flex-1 flex-col gap-4 overflow-y-auto">
					{/* 지역 전체 */}
					<button
						onClick={() => {
							setSelectedRegion("");
							setSelectedDistrict("");
						}}
						className={cn(
							"flex h-[2.5rem] min-h-[2.5rem] w-full cursor-pointer items-center justify-between gap-1.5 rounded-xl bg-gray-50 px-4 text-base text-gray-800 transition-colors",
							"md:h-[2.875rem] md:min-h-[2.875rem]",
							isAllSelected ? "border border-purple-500" : "border border-gray-50",
						)}>
						<span>지역 전체</span>
						{isAllSelected && <IcCheck />}
					</button>

					{/* 시/도 리스트 */}
					{REGION_DATA.map((region) => (
						<RegionDropdown
							key={region.value}
							triggerLabel={region.label}
							options={region.districts.map((d) => d.label)}
							value={selectedRegion === region.value ? selectedDistrict : ""}
							onChange={(value: string) => {
								setSelectedRegion(region.value);
								setSelectedDistrict(value);
							}}
						/>
					))}
				</div>

				{/* 하단 버튼 영역 */}
				<div className="mt-8 flex gap-2.5 md:mt-[3.5rem] md:gap-4">
					{/* 취소 버튼 */}
					<button
						onClick={onClose}
						className="flex h-12 w-[141px] cursor-pointer items-center justify-center rounded-2xl border border-gray-200 md:h-[3.75rem] md:w-auto md:flex-1">
						취소
					</button>

					{/* 확인 버튼 */}
					<button
						onClick={() => {
							onConfirm(selectedRegion, selectedDistrict);
							onClose();
						}}
						className="flex h-12 w-[141px] cursor-pointer items-center justify-center rounded-2xl bg-purple-500 text-white md:h-[3.75rem] md:w-auto md:flex-1">
						확인
					</button>
				</div>
			</div>
		</div>
	);
}
