"use client";

import { useState } from "react";
import NameField from "@/features/meetup/components/NameField";
import AddressField from "@/features/meetup/components/AddressField";
import FileField from "@/features/meetup/components/FileField";
import { getKakaoPlace } from "@/features/meetup/apis";
import TypeSelectField from "@/features/meetupDetail/edit/components/TypeSelectField";
import { useEditFormData } from "@/features/meetupDetail/edit/providers/EditFormDataProvider";
import { MeetupEditData } from "@/features/meetupDetail/edit/types";
import { useAddressField } from "@/features/meetupDetail/edit/hooks/useAddressField";
import { uploadImage } from "@/apis/images";
import DescField from "@/features/meetup/components/DescField";

export default function TabBasicInfo() {
	const { data, setData } = useEditFormData();
	const [isComboOpened, setIsComboOpened] = useState(false);
	const { addressValue, setAddressValue } = useAddressField();

	const updateField = (updates: Partial<MeetupEditData>) => {
		setData((prev) => ({ ...prev, ...updates }));
	};

	return (
		<fieldset className="flex flex-col gap-y-4 md:gap-y-6" onClick={() => setIsComboOpened(false)}>
			<TypeSelectField value={data.type} onChange={(value) => updateField({ type: value })} />
			<NameField value={data.name} onChange={(value) => updateField({ name: value })} />
			<AddressField
				isComboOpened={isComboOpened}
				setIsComboOpened={setIsComboOpened}
				value={addressValue}
				setValue={setAddressValue}
				firstName="_addressName"
				secondName="_addressDetail"
				getKakaoPlaceFn={getKakaoPlace}
			/>
			<FileField
				defaultUrl={data.image}
				onChange={(value) => updateField({ image: value })}
				uploadImageFn={uploadImage}
			/>
			<DescField
				value={data.description}
				onChange={(value) => updateField({ description: value })}
			/>
		</fieldset>
	);
}
