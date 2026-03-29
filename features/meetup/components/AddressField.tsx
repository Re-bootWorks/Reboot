"use client";

import { useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import Input from "@/components/ui/Inputs/Input";
import InputField from "@/components/ui/Inputs/InputField";
import { IcLocation } from "@/components/ui/icons";
import { getKakaoPlaceFn, KakaoPlaceItem } from "../types";
import { debounce } from "@/utils/performance";
import { useToast } from "@/providers/toast-provider";
import { getRegion, validatePlaceSearch, validateText } from "../utils";

interface AddressFieldProps<N extends string = "addressName", D extends string = "addressDetail"> {
	/** 주소 검색 콤보박스 열림 여부 */
	isComboOpened: boolean;
	/** 주소 검색 콤보박스 열림 여부 설정 */
	setIsComboOpened: React.Dispatch<React.SetStateAction<boolean>>;
	/** 주소 입력 값 */
	value: AddressValues<N, D>;
	/** 주소 입력 값 변경 시 호출 */
	onValuesChange?: (values: AddressValues<N, D>) => void;
	/** 주소 입력 값 변경 함수 */
	setValue?: React.Dispatch<React.SetStateAction<AddressValues<N, D>>>;
	/** 카카오 장소 검색 함수 */
	getKakaoPlaceFn: getKakaoPlaceFn;
	/** 필수 필드 여부 @default true */
	isRequired?: boolean;
	/** 첫 번째 주소 필드 이름 @default "addressName" */
	firstName?: N;
	/** 두 번째 주소 필드 이름 @default "addressDetail" */
	secondName?: D;
}
const DEFAULT_FIRST = "addressName";
const DEFAULT_SECOND = "addressDetail";
type DefaultFirst = typeof DEFAULT_FIRST;
type DefaultSecond = typeof DEFAULT_SECOND;

export type AddressValues<N extends string = DefaultFirst, D extends string = DefaultSecond> = {
	latitude: number;
	longitude: number;
	region: string;
} & Record<N, string> &
	Record<D, string>;

export default function AddressField<
	const N extends string = DefaultFirst,
	const D extends string = DefaultSecond,
>({
	isComboOpened,
	setIsComboOpened,
	value,
	setValue,
	onValuesChange,
	getKakaoPlaceFn,
	isRequired = true,
	firstName = DEFAULT_FIRST as N,
	secondName = DEFAULT_SECOND as D,
}: AddressFieldProps<N, D>) {
	const [kakaoAddressData, setKakaoAddressData] = useState<KakaoPlaceItem[]>([]);
	const { handleShowToast } = useToast();

	// 디바운스 적용
	const fetchAddressesDebounced = useMemo(
		() =>
			debounce(async (query: string) => {
				try {
					const data = await getKakaoPlaceFn(query);
					setKakaoAddressData(Array.isArray(data) ? data : []);
				} catch (error) {
					let message: string;
					if (error instanceof Error) {
						message = error.message;
					} else {
						message = "카카오 장소 검색 중 오류가 발생했습니다.";
					}
					handleShowToast({ message, status: "error" });
				}
			}, 100),
		[getKakaoPlaceFn],
	);

	function handleChangeAddress(e: React.ChangeEvent<HTMLInputElement>) {
		const inputValue = e.target.value;
		const next: AddressValues<N, D> = { ...value, ...makeRecord(firstName, inputValue) };
		setValue?.(next);
		onValuesChange?.(next);
		if (!validateText(inputValue)) {
			setKakaoAddressData([]);
			return;
		}
		if (!validatePlaceSearch(inputValue)) return;
		fetchAddressesDebounced(inputValue);
	}

	function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value: inputValue } = e.target;
		const next = { ...value, ...makeRecord(name as N | D, inputValue) };
		setValue?.(next);
		onValuesChange?.(next);
	}

	function handleClickStreet(data: KakaoPlaceItem) {
		const next: AddressValues<N, D> = {
			...value,
			latitude: Number(data.y),
			longitude: Number(data.x),
			region: getRegion(data.address_name),
			...makeRecord(firstName, data.address_name),
		};
		setValue?.(next);
		onValuesChange?.(next);
		setIsComboOpened(false);
	}

	return (
		<div role="group" aria-labelledby="address-label" className="flex flex-col gap-y-2">
			<div className="relative">
				<InputField
					name={firstName}
					label="장소"
					placeholder="건물, 지번 또는 도로명 검색"
					rightIcon={<IcLocation color="#444" size="md" />}
					isRequired={isRequired}
					value={value[firstName]}
					onChange={handleChangeAddress}
					onClick={(e) => e.stopPropagation()}
					onFocus={() => setIsComboOpened(true)}
					spellCheck={false}
					autoComplete="off"
				/>
				{isComboOpened && (
					<AddressSearchCombobox data={kakaoAddressData} onClick={handleClickStreet} />
				)}
			</div>
			<Input
				name={secondName}
				placeholder="상세 주소"
				required={isRequired}
				value={value[secondName]}
				onChange={handleChangeInput}
				spellCheck={false}
				autoComplete="off"
			/>
		</div>
	);
}

interface AddressSearchComboboxProps {
	data?: KakaoPlaceItem[];
	onClick: (data: KakaoPlaceItem) => void;
}
function AddressSearchCombobox({ data, onClick }: AddressSearchComboboxProps) {
	const options = Array.isArray(data) ? data : [];

	return (
		options.length > 0 && (
			<div className={cn(...optionsVariants)} role="listbox">
				{options.map((item) => (
					<button
						key={item.id}
						type="button"
						onClick={() => onClick(item)}
						className={cn(...optionContentVariants)}>
						<span className="text-left text-sm">{item.address_name}</span>
						<span className="text-left text-xs text-gray-500">{`${item.road_address_name} ${item.place_name}`}</span>
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
	"w-full cursor-pointer flex flex-col select-none items-start justify-start rounded-lg px-2.5 py-2.5 font-medium transition-colors md:text-base text-gray-800",
	"hover:bg-gray-50 focus:bg-gray-50",
	"disabled:cursor-not-allowed disabled:text-gray-300",
];

// computed key를 제네릭 Record로 안전하게 생성
function makeRecord<K extends string>(key: K, val: string): Record<K, string> {
	return { [key]: val } as Record<K, string>;
}
