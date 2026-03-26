"use client";

import { useEffect, useState } from "react";
import { getKakaoPlaceFn, UploadImageFn } from "../../types";
import { getAddress } from "../../utils";
import { useFormData } from "../providers/FormDataProvider";
import AddressField, { AddressValues } from "../../components/AddressField";
import NameField from "../../components/NameField";
import FileField from "../../components/FileField";

interface StepInfoProps {
	/** 단계 숫자 */
	step: number;
	uploadImageFn: UploadImageFn;
	getKakaoPlaceFn: getKakaoPlaceFn;
}
export default function StepInfo({ step, uploadImageFn, getKakaoPlaceFn }: StepInfoProps) {
	const { setStepValid, setData } = useFormData();
	const [isComboOpened, setIsComboOpened] = useState(false);
	const [addressValues, setAddressValues] = useState<AddressValues>({
		latitude: 0,
		longitude: 0,
		region: "",
		addressName: "",
		addressDetail: "",
	});
	const [name, setName] = useState<string>("");
	const [image, setImage] = useState<string>("");

	// 유효성 검사 및 데이터 업데이트
	useEffect(() => {
		const { latitude, longitude, addressName, addressDetail, region } = addressValues;
		const isLocationValid = !!(addressName && addressDetail && region);
		const isValid = !!(name && image && isLocationValid);

		setStepValid(step, isValid);
		setData((prev) => ({
			...prev,
			name,
			latitude,
			longitude,
			region,
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
				getKakaoPlaceFn={getKakaoPlaceFn}
			/>
			<FileField defaultUrl={image} onChange={setImage} uploadImageFn={uploadImageFn} />
		</fieldset>
	);
}
