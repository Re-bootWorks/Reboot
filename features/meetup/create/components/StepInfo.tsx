"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { KakaoAddressItem, MeetupCreateData } from "../types";
import { getAddress, getRegion } from "../utils";
import { useLeaveStep } from "../hooks";
import { useFormData } from "../providers/FormDataProvider";
import { useFormStep } from "../providers/FormStepProvider";
import Input from "@/components/ui/Inputs/Input";
import InputField from "@/components/ui/Inputs/InputField";
import InputFile from "@/components/ui/Inputs/InputFile";
import { IcLocation } from "@/components/ui/icons";

interface StepInfoProps {
	/** 단계 숫자 */
	step: number;
	uploadImageFunc: (e: React.ChangeEvent<HTMLInputElement>) => Promise<string>;
	kakaoAddressFunc: (e: React.ChangeEvent<HTMLInputElement>) => Promise<KakaoAddressItem[]>;
}
type InputValues = {
	name: MeetupCreateData["name"];
	image: MeetupCreateData["image"];
	latitude: MeetupCreateData["latitude"];
	longitude: MeetupCreateData["longitude"];
	regionFirst: KakaoAddressItem["address"]["region_1depth_name"];
	regionSecond: KakaoAddressItem["address"]["region_2depth_name"];
	addressName: KakaoAddressItem["road_address"]["address_name"];
	addressDetail: string;
};
export default function StepInfo({ step, uploadImageFunc, kakaoAddressFunc }: StepInfoProps) {
	const { currentStep } = useFormStep();
	const { setStepValid, setData } = useFormData();
	const [isComboOpened, setIsComboOpened] = useState(false);
	const [kakaoAddressData, setKakaoAddressData] = useState<KakaoAddressItem[]>([]);
	const [inputValues, setInputValues] = useState<InputValues>({
		name: "",
		image: "",
		latitude: 0,
		longitude: 0,
		regionFirst: "",
		regionSecond: "",
		addressName: "",
		addressDetail: "",
	});

	// 이 단계를 떠나는 순간 한 번 실행
	function setCurrentData() {
		setData((prev) => ({
			...prev,
			name: inputValues.name,
			latitude: inputValues.latitude,
			longitude: inputValues.longitude,
			region: getRegion(inputValues.regionFirst, inputValues.regionSecond),
			address: getAddress(inputValues.addressName, inputValues.addressDetail),
			image: inputValues.image,
		}));
	}
	useLeaveStep({ currentStep, step, onLeave: setCurrentData });

	async function handleChangeAddress(e: React.ChangeEvent<HTMLInputElement>) {
		setInputValues((prev) => ({ ...prev, addressName: e.target.value }));
		const data = await kakaoAddressFunc(e);
		if (data) {
			setKakaoAddressData(data);
		}
	}

	async function handleUploadImage(e: React.ChangeEvent<HTMLInputElement>) {
		const image = await uploadImageFunc(e);
		if (image) {
			setInputValues((prev) => ({ ...prev, image }));
		}
	}

	function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setInputValues((prev) => ({ ...prev, [name]: value }));
	}

	function handleClickStreet(data: KakaoAddressItem) {
		setInputValues((prev) => ({
			...prev,
			latitude: Number(data.x),
			longitude: Number(data.y),
			regionFirst: data.road_address?.region_1depth_name ?? data.address.region_1depth_name,
			regionSecond: data.road_address?.region_2depth_name ?? data.address.region_2depth_name,
			addressName: data.road_address?.address_name ?? data.address.address_name,
		}));
		setIsComboOpened(false);
	}

	// 유효성 검사
	useEffect(() => {
		if (Object.values(inputValues).every((value) => !!value)) {
			setStepValid(step, true);
		}
	}, [inputValues, setStepValid, step]);

	return (
		<fieldset className="flex flex-col gap-y-4 md:gap-y-6" onClick={() => setIsComboOpened(false)}>
			<InputField
				name="name"
				label="모임 이름"
				placeholder="모임 이름을 입력해 주세요"
				isRequired
				onChange={handleChangeInput}
			/>
			<div role="group" aria-labelledby="address-label" className="flex flex-col gap-y-2">
				<div className="relative">
					<InputField
						name="addressName"
						label="장소"
						placeholder="건물, 지번 또는 도로명 검색"
						rightIcon={<IcLocation color="#444" size="md" />}
						isRequired
						value={inputValues.addressName}
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
			<InputFile label="이미지" name="imageUrl" isRequired onChange={handleUploadImage} />
		</fieldset>
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
