import { useEditFormData } from "@/features/meetupDetail/edit/providers/EditFormDataProvider";
import { AddressValues } from "@/features/meetup/components/AddressField";
import { useMemo } from "react";

export function useAddressField() {
	const { data, setData } = useEditFormData();
	const addressValue = useMemo(
		() => ({
			latitude: data.latitude,
			longitude: data.longitude,
			addressName: data.address,
			region: data.region,
			addressDetail: "",
		}),
		[data.address, data.latitude, data.longitude, data.region],
	);

	const setAddressValue = (updater: React.SetStateAction<AddressValues>) => {
		const next = typeof updater === "function" ? updater(addressValue) : updater;

		setData((prev) => {
			if (prev.address === next.addressName && prev.latitude === next.latitude) {
				return prev;
			}

			return {
				...prev,
				latitude: next.latitude,
				longitude: next.longitude,
				address: next.addressName,
				region: next.region,
			};
		});
	};

	return { addressValue, setAddressValue };
}
