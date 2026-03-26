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
