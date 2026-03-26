"use client";

import { useEffect, useState } from "react";
import { GetKakaoAddressFn, UploadImageFn } from "../../types";
import { getAddress, getRegion } from "../../utils";
import { useFormData } from "../providers/FormDataProvider";
import AddressField, { AddressValues } from "../../components/AddressField";
import NameField from "../../components/NameField";
import FileField from "../../components/FileField";

interface StepInfoProps {
	/** 단계 숫자 */
	step: number;
	uploadImageFn: UploadImageFn;
	getKakaoAddressFn: GetKakaoAddressFn;
}
export default function StepInfo({ step, uploadImageFn, getKakaoAddressFn }: StepInfoProps) {
	const { setStepValid, setData } = useFormData();
	const [isComboOpened, setIsComboOpened] = useState(false);
	const [addressValues, setAddressValues] = useState<AddressValues>({
		latitude: 0,
		longitude: 0,
		regionFirst: "",
		regionSecond: "",
		addressName: "",
		addressDetail: "",
	});
	const [name, setName] = useState<string>("");
	const [image, setImage] = useState<string>("");

	// 유효성 검사 및 데이터 업데이트
	useEffect(() => {
		const { latitude, longitude, addressName, addressDetail, regionFirst, regionSecond } =
			addressValues;
		const isLocationValid = !!(addressName && addressDetail && regionFirst && regionSecond);
		const isValid = !!(name && image && isLocationValid);

		setStepValid(step, isValid);
		setData((prev) => ({
			...prev,
			name,
			latitude,
			longitude,
			region: getRegion(regionFirst, regionSecond),
			address: getAddress(addressName, addressDetail),
			image,
		}));
	}, [name, image, addressValues, setStepValid, step]);

	return (
		<fieldset className="flex flex-col gap-y-4 md:gap-y-6" onClick={() => setIsComboOpened(false)}>
			<NameField name="name" value={name} onChange={setName} />
			<AddressField
				isComboOpened={isComboOpened}
				setIsComboOpened={setIsComboOpened}
				value={addressValues}
				setValue={setAddressValues}
				getKakaoAddressFn={getKakaoAddressFn}
			/>
			<FileField defaultUrl={image} onChange={setImage} uploadImageFn={uploadImageFn} />
		</fieldset>
	);
}
