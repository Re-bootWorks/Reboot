"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import Input from "@/components/ui/Inputs/Input";
import InputField from "@/components/ui/Inputs/InputField";
import { IcLocation } from "@/components/ui/icons";
import { KakaoAddressFunc, KakaoAddressItem } from "../types";

interface AddressFieldProps {
	/** 주소 검색 콤보박스 열림 여부 */
	isComboOpened: boolean;
	/** 주소 검색 콤보박스 열림 여부 설정 */
	setIsComboOpened: React.Dispatch<React.SetStateAction<boolean>>;
	/** 주소 입력 값 */
	value: AddressValues;
	/** 주소 입력 값 변경 함수 */
	setValue: React.Dispatch<React.SetStateAction<AddressValues>>;
	/** 카카오 주소 검색 함수 */
	kakaoAddressFunc: KakaoAddressFunc;
}

export type AddressValues = {
	/** 위도 */
	latitude: number;
	/** 경도 */
	longitude: number;
	/** 시도 */
	regionFirst: KakaoAddressItem["road_address"]["region_1depth_name"];
	/** 시군구 */
	regionSecond: KakaoAddressItem["road_address"]["region_2depth_name"];
	/** 기본 주소 */
	addressName: KakaoAddressItem["road_address"]["address_name"];
	/** 사용자 입력 상세 주소 */
	addressDetail: string;
};
export default function AddressField({
	isComboOpened,
	setIsComboOpened,
	value,
	setValue,
	kakaoAddressFunc,
}: AddressFieldProps) {
	const [kakaoAddressData, setKakaoAddressData] = useState<KakaoAddressItem[]>([]);

	async function handleChangeAddress(e: React.ChangeEvent<HTMLInputElement>) {
		setValue((prev) => ({ ...prev, addressName: e.target.value }));
		const data = await kakaoAddressFunc(e);
		if (data) {
			setKakaoAddressData(data);
		}
	}

	function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setValue((prev) => ({ ...prev, [name]: value }));
	}

	function handleClickStreet(data: KakaoAddressItem) {
		setValue((prev) => ({
			...prev,
			latitude: Number(data.x),
			longitude: Number(data.y),
			regionFirst: data.road_address?.region_1depth_name ?? data.address.region_1depth_name,
			regionSecond: data.road_address?.region_2depth_name ?? data.address.region_2depth_name,
			addressName: data.road_address?.address_name ?? data.address.address_name,
		}));
		setIsComboOpened(false);
	}

	return (
		<div role="group" aria-labelledby="address-label" className="flex flex-col gap-y-2">
			<div className="relative">
				<InputField
					name="addressName"
					label="장소"
					placeholder="건물, 지번 또는 도로명 검색"
					rightIcon={<IcLocation color="#444" size="md" />}
					isRequired
					value={value.addressName}
					onChange={handleChangeAddress}
					onClick={(e) => e.stopPropagation()}
					onFocus={() => setIsComboOpened(true)}
				/>
				{isComboOpened && (
					<AddressSearchCombobox data={kakaoAddressData} onClick={handleClickStreet} />
				)}
			</div>
			<Input name="addressDetail" placeholder="상세 주소" required onChange={handleChangeInput} />
		</div>
	);
}

interface AddressSearchComboboxProps {
	data?: KakaoAddressItem[];
	onClick: (data: KakaoAddressItem) => void;
}
function AddressSearchCombobox({ data, onClick }: AddressSearchComboboxProps) {
	const options = Array.isArray(data) ? data : [];

	return (
		options.length > 0 && (
			<div className={cn(...optionsVariants)} role="listbox">
				{options.map((item, i) => (
					<button
						key={(item.address_name ?? "") + (item.x ?? "") + (item.y ?? "") + i}
						type="button"
						onClick={() => onClick(item)}
						className={cn(...optionContentVariants)}>
						{item.address_name}
					</button>
				))}
			</div>
		)
	);
}
const optionsVariants = [
	"absolute left-0 top-full z-20 mt-2 max-h-55 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white scrollbar-hide",
	"shadow-xl outline-none",
	"origin-top transition duration-150 ease-out",
	"data-[closed]:scale-95 data-[closed]:opacity-0",
];

const optionContentVariants = [
	"flex select-none items-center rounded-lg px-2.5 py-4 font-medium transition-colors md:text-base text-gray-800",
	"focus:bg-gray-50",
	"disabled:cursor-not-allowed disabled:text-gray-300",
];
