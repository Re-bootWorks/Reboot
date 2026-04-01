"use client";

import { useState, useEffect } from "react";
import { REGION_DATA } from "@/constants/region";
import IcDelete from "@/components/ui/icons/IcDelete";
import IcCheck from "@/components/ui/icons/IcCheck";
import { cn } from "@/utils/cn";
import Button from "@/components/ui/Buttons/Button";
import { Option } from "./option";
import SelectDropdown from "@/components/ui/Dropdowns/SelectDropdown";

interface RegionModalProps {
	isOpen: boolean; // 모달 열림 여부
	onClose: () => void; // 모달 닫기 함수
	onConfirm: (data: {
		region: Option | null;
		district: Option | null;
		fullLabel: string; //조합된 전체 텍스트
	}) => void;
	initialRegion: Option | null; // 부모에서 전달받은 초기 지역값
	initialDistrict: Option | null; // 부모에서 전달받은 초기 구/군 값
}

export default function RegionModal({
	isOpen,
	onClose,
	onConfirm,
	initialRegion,
	initialDistrict,
}: RegionModalProps) {
	// 모달 내부에서 임시로 관리하는 선택 상태
	const [selectedRegion, setSelectedRegion] = useState<Option | null>(null);
	const [selectedDistrict, setSelectedDistrict] = useState<Option | null>(null);

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

	// 지역/구군 선택 시 상태 업데이트
	const handleSelect = (region: Option, district: Option) => {
		setSelectedRegion(region);
		setSelectedDistrict(district);
	};

	//  선택값 전체 초기화
	const handleAll = () => {
		setSelectedRegion(null);
		setSelectedDistrict(null);
	};

	// 확인 버튼 클릭 시 최종 선택값 전달 후 모달 닫기
	const handleConfirm = () => {
		const fullLabel =
			selectedRegion && selectedDistrict ? `${selectedRegion.label} ${selectedDistrict.label}` : "";
		onConfirm({
			region: selectedRegion,
			district: selectedDistrict,
			fullLabel,
		});

		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="flex h-[36.5rem] w-[21.375rem] flex-col rounded-3xl bg-white px-6 pt-8 pb-6 md:h-[46rem] md:w-[34rem] md:rounded-[2.5rem] md:p-12">
				{/* 헤더 영역 */}
				<div className="mb-8 flex h-7 w-[18.375rem] items-center justify-between md:mb-12 md:h-8 md:w-[28rem]">
					<h2 className="text-lg leading-7 font-semibold md:text-2xl md:leading-8">지역 선택</h2>

					{/* 모달 닫기 버튼 */}
					<button onClick={onClose} className="cursor-pointer">
						<IcDelete />
					</button>
				</div>

				{/* 지역 선택 리스트 */}
				<div className="scrollbar flex flex-1 flex-col gap-4 overflow-y-auto">
					{/* 지역 전체 */}
					<button
						onClick={handleAll}
						className={cn(
							"flex h-[2.5rem] min-h-[2.5rem] w-full cursor-pointer items-center justify-between gap-1.5 rounded-xl bg-gray-50 px-3 py-2.5 text-sm text-gray-800 transition-colors md:text-base",
							"md:h-[2.875rem] md:min-h-[3rem]",
							isAllSelected ? "border border-purple-500" : "border border-gray-50",
						)}>
						<span>지역 전체</span>
						{isAllSelected && <IcCheck className="aspect-square w-[1.125rem] md:w-[1.5rem]" />}
					</button>

					{/* 시/도 리스트 */}
					{REGION_DATA.map((region) => (
						<SelectDropdown
							key={region.value}
							triggerLabel={region.label}
							options={region.districts.map((d) => d.label)}
							value={selectedRegion?.value === region.value ? (selectedDistrict?.label ?? "") : ""}
							onChange={(label: string) => {
								const districtOption = region.districts.find((d) => d.label === label);

								if (!districtOption) return;

								handleSelect({ value: region.value, label: region.label }, districtOption);
							}}
						/>
					))}
				</div>

				{/* 하단 버튼 영역 */}
				<div className="mt-8 flex gap-3 md:mt-14 md:gap-4">
					{/* 취소 버튼 */}
					<Button
						onClick={onClose}
						colors="grayBorder"
						className="h-12 w-[141px] rounded-2xl md:h-[3.75rem] md:w-auto md:flex-1 md:text-xl">
						취소
					</Button>

					{/* 확인 버튼 */}
					<Button
						onClick={handleConfirm}
						className="h-12 w-[141px] rounded-2xl md:h-[3.75rem] md:w-auto md:flex-1 md:text-xl">
						확인
					</Button>
				</div>
			</div>
		</div>
	);
}
