import { useEditFormData } from "@/features/meetupDetail/edit/providers/EditFormDataProvider";
import { AddressValues } from "@/features/meetup/components/AddressField";
import { useMemo } from "react";
import { getAddress } from "@/features/meetup/utils";

type EditAddressValues = AddressValues<"_addressName", "_addressDetail">;

export function useAddressField() {
	const { data, setData } = useEditFormData();
	const addressValue = useMemo<EditAddressValues>(
		() => ({
			latitude: data.latitude,
			longitude: data.longitude,
			region: data.region,
			_addressName: data._addressName,
			_addressDetail: data._addressDetail,
		}),
		[data._addressName, data._addressDetail, data.latitude, data.longitude, data.region],
	);

	const setAddressValue = (updater: React.SetStateAction<EditAddressValues>) => {
		const next = typeof updater === "function" ? updater(addressValue) : updater;

		setData((prev) => {
			return {
				...prev,
				latitude: next.latitude,
				longitude: next.longitude,
				_addressName: next._addressName,
				_addressDetail: next._addressDetail,
				address: getAddress(next._addressName, next._addressDetail),
				region: next.region,
			};
		});
	};

	return { addressValue, setAddressValue };
}
