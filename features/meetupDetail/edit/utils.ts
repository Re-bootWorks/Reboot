import { Meeting } from "@/features/meetupDetail/types";
import { MeetupEditData } from "./types";
import dayjs from "@/libs/dayjs";
import { splitAddress, validateCapacity, validateText } from "@/features/meetup/utils";
import { MIN_CONFIRMED_COUNT } from "@/features/meetupDetail/components/PersonnelContainer";

export function toMeetupEditData(meeting: Meeting): MeetupEditData {
	const {
		name,
		type,
		region,
		address,
		latitude,
		longitude,
		dateTime,
		registrationEnd,
		capacity,
		image,
		description,
	} = meeting;
	const { addressName, addressDetail } = splitAddress(meeting.address);
	return {
		name,
		type,
		region,
		address,
		_addressName: addressName ?? "",
		_addressDetail: addressDetail ?? "",
		latitude,
		longitude,
		dateTime,
		registrationEnd,
		capacity,
		image,
		description,
	};
}

export const TAB_IDS = {
	BASIC: "basic",
	SCHEDULE: "schedule",
} as const;

export type TabId = (typeof TAB_IDS)[keyof typeof TAB_IDS];

/** 정원이 현재 참가자 수 이상인지 검사 */
export function validateCapacityOverParticipants(capacity: number, participantCount: number) {
	return capacity >= participantCount;
}

/** 모임 일시가 현재 시각 이후인지 검사 */
export function validateDateTimeIsFuture(dateTime: string) {
	return dayjs(dateTime).isAfter(dayjs());
}

/** 최대 정원이 최소 인원보다 크거나 같은지 검사 */
export function validateMaxCapacity(capacity: number, MIN_CONFIRMED_COUNT: number) {
	return capacity >= MIN_CONFIRMED_COUNT;
}

/** 모집 마감이 모임 일정보다 이전인지 검사 */
export function validateDateTimeOrder(dateTime: string, registrationEnd: string) {
	return dayjs(registrationEnd).isBefore(dayjs(dateTime));
}

/** 유효성 검사 항목 배열 */
export const EDIT_VALIDATIONS: {
	test: (d: MeetupEditData) => boolean;
	message: string;
	tab: TabId;
}[] = [
	{ test: (d) => validateText(d.type), message: "모임 종류를 선택해 주세요.", tab: TAB_IDS.BASIC },
	{ test: (d) => validateText(d.name), message: "모임 이름을 입력해 주세요.", tab: TAB_IDS.BASIC },
	{
		test: (d) => validateText(d.address),
		message: "모임 장소를 입력해 주세요.",
		tab: TAB_IDS.BASIC,
	},
	{
		test: (d) => validateText(d.image),
		message: "모임 이미지를 등록해 주세요.",
		tab: TAB_IDS.BASIC,
	},
	{
		test: (d) => validateText(d.description),
		message: "모임 설명을 입력해 주세요.",
		tab: TAB_IDS.BASIC,
	},
	{
		test: (d) => validateText(d.dateTime),
		message: "모임 일정을 입력해 주세요.",
		tab: TAB_IDS.SCHEDULE,
	},
	{
		test: (d) => validateDateTimeIsFuture(d.dateTime),
		message: "모임 일시는 현재 시각 이후여야 합니다.",
		tab: TAB_IDS.SCHEDULE,
	},
	{
		test: (d) => validateText(d.registrationEnd),
		message: "모집 마감 날짜를 입력해 주세요.",
		tab: TAB_IDS.SCHEDULE,
	},
	{
		test: (d) => validateDateTimeOrder(d.dateTime, d.registrationEnd),
		message: "모집 마감은 모임 일정 이전이어야 합니다.",
		tab: TAB_IDS.SCHEDULE,
	},
	{
		test: (d) => validateCapacity(d.capacity),
		message: "모임 정원을 입력해 주세요.",
		tab: TAB_IDS.SCHEDULE,
	},
	{
		test: (d) => validateMaxCapacity(d.capacity, MIN_CONFIRMED_COUNT),
		message: `최대 인원은 ${MIN_CONFIRMED_COUNT}이상이어야 합니다.`,
		tab: TAB_IDS.SCHEDULE,
	},
];
