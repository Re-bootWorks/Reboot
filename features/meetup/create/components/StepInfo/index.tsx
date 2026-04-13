"use client";

import { useEffect, useState } from "react";
import type { getKakaoPlaceFn } from "../../../apis";
import type { UploadImageFn } from "@/apis/images";
import { useFormData } from "../../providers/FormDataProvider";
import AddressField from "@/features/meetup/components/AddressField";
import NameField from "@/features/meetup/components/NameField";
import FileField from "@/features/meetup/components/FileField";

interface StepInfoProps {
	/** 단계 숫자 */
	step: number;
	uploadImageFn: UploadImageFn;
	getKakaoPlaceFn: getKakaoPlaceFn;
}
export default function StepInfo({ step, uploadImageFn, getKakaoPlaceFn }: StepInfoProps) {
	const { setStepValid, data, setData } = useFormData();
	const [isComboOpened, setIsComboOpened] = useState(false);

	// 유효성 검사 및 데이터 업데이트
	useEffect(() => {
		const { latitude, longitude, _addressName, _addressDetail, region } = data;
		const isCoorValid = latitude && longitude;
		const isLocationValid = !!(_addressName && _addressDetail && region);
		const isValid = !!(data.name && data.image && isCoorValid && isLocationValid);
		setStepValid(step, isValid);
	}, [data, setStepValid, step]);

	function handleChangeInput(_: string, e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setData((prev) => ({ ...prev, [name]: value }));
	}

	function handleChangeImage(imageUrl: string) {
		setData((prev) => ({ ...prev, image: imageUrl }));
	}

	return (
		<fieldset className="flex flex-col gap-y-4 md:gap-y-6" onClick={() => setIsComboOpened(false)}>
			<NameField name="name" value={data.name} onChange={handleChangeInput} />
			<AddressField
				isComboOpened={isComboOpened}
				setIsComboOpened={setIsComboOpened}
				value={{
					latitude: data.latitude,
					longitude: data.longitude,
					region: data.region,
					_addressName: data._addressName,
					_addressDetail: data._addressDetail,
				}}
				onValuesChange={(values) => setData((prev) => ({ ...prev, ...values }))}
				firstName="_addressName"
				secondName="_addressDetail"
				getKakaoPlaceFn={getKakaoPlaceFn}
			/>
			<FileField
				defaultUrl={data.image}
				onChange={handleChangeImage}
				uploadImageFn={uploadImageFn}
			/>
		</fieldset>
	);
}
