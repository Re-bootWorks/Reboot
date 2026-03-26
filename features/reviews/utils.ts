import { REGION_DATA } from "@/constants/region";
import { Option } from "@/components/ui/Filter/RegionFilter/option";

export interface RegionFilterValue {
	region: Option | null;
	district: Option | null;
	fullLabel: string;
}

export function getRegionItem(param: string | null): RegionFilterValue {
	if (!param) {
		return { region: null, district: null, fullLabel: "" };
	}

	const [regionLabel, districtLabel] = param.split(" ");
	const regionData = REGION_DATA.find((r) => r.label === regionLabel);

	if (!regionData) {
		return { region: null, district: null, fullLabel: "" };
	}

	const region: Option = {
		label: regionData.label,
		value: regionData.label,
	};

	const district = regionData.districts.find((d) => d.label === districtLabel) ?? null;

	return {
		region,
		district,
		fullLabel: district ? `${region.label} ${district.label}` : region.label,
	};
}

export function buildRegionParam(region: Option | null, district: Option | null) {
	if (!region || !district) {
		return null;
	}

	return `${region.label} ${district.label}`;
}
