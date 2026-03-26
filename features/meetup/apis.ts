import { KakaoAddressItem } from "./types";

export async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
	// TODO: 이미지 업로드 처리(파일 분리)
	const file = e.target.files?.[0];
	if (file) {
		const url = URL.createObjectURL(file);
		return url;
	} else return "";
}

export async function getKakaoAddress() {
	// TODO: 외부 API 연동 및 드롭다운 목록 표시(파일 분리)
	return MOCK_DATA;
}
const MOCK_DATA: KakaoAddressItem[] = [
	{
		address: {
			address_name: "서울 강남구 역삼동 825",
			b_code: "1168010100",
			h_code: "1168064000",
			main_address_no: "825",
			mountain_yn: "N",
			region_1depth_name: "서울",
			region_2depth_name: "강남구",
			region_3depth_h_name: "역삼1동",
			region_3depth_name: "역삼동",
			sub_address_no: "",
			x: "127.028578846319",
			y: "37.4978399531903",
		},
		address_name: "서울 강남구 강남대로 390",
		address_type: "ROAD_ADDR",
		road_address: {
			address_name: "서울 강남구 강남대로 390",
			building_name: "미진프라자",
			main_building_no: "390",
			region_1depth_name: "서울",
			region_2depth_name: "강남구",
			region_3depth_name: "역삼동",
			road_name: "강남대로",
			sub_building_no: "",
			underground_yn: "N",
			x: "127.028578846319",
			y: "37.4978399531903",
			zone_no: "06232",
		},
		x: "127.028578846319",
		y: "37.4978399531903",
	},
];
