export interface MeetupCreateData {
	/** 모임 이름 */
	name: string;
	/** 모임 종류 */
	type: string;
	/** 모임 지역 */
	region: string;
	/** 모임 상세 주소 */
	address: string;
	/** 모임 장소 위도 */
	latitude: number;
	/** 모임 장소 경도 */
	longitude: number;
	/** 모임 일시 */
	dateTime: string;
	/** 모임 마감 일시 */
	registrationEnd: string;
	/** 모임 정원 */
	capacity: number;
	/** 모임 이미지 */
	image: string;
	/** 모임 설명 */
	description: string;
}

export interface KakaoAddressItem {
	address: {
		address_name: string;
		b_code: string;
		h_code: string;
		main_address_no: string;
		mountain_yn: string;
		region_1depth_name: string;
		region_2depth_name: string;
		region_3depth_h_name: string;
		region_3depth_name: string;
		sub_address_no: string;
		x: string;
		y: string;
	};
	address_name: string;
	address_type: "REGION" | "ROAD" | "REGION_ADDR" | "ROAD_ADDR";
	road_address: {
		address_name: string;
		building_name: string;
		main_building_no: string;
		region_1depth_name: string;
		region_2depth_name: string;
		region_3depth_name: string;
		road_name: string;
		sub_building_no: string;
		underground_yn: string;
		x: string;
		y: string;
		zone_no: string;
	};
	x: string;
	y: string;
}
