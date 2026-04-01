import { parseTimestamp } from "@/utils/date";
import { getAddress } from "../utils";
import { MeetupCreateFormData } from "./providers/FormDataProvider";
import { MeetupCreateRequest } from "../types";

const SESSION_KEY = "meetup-create-data";
export const createSessionStore = {
	get() {
		const data = sessionStorage.getItem(SESSION_KEY);
		if (data) {
			return JSON.parse(data);
		}
	},
	set(patch: Partial<MeetupCreateFormData>) {
		const prev = createSessionStore.get() as Partial<MeetupCreateFormData> | undefined;
		sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...(prev ?? {}), ...patch }));
	},
	remove() {
		sessionStorage.removeItem(SESSION_KEY);
	},
};

/** 모임 만들기 폼 데이터에서 실제 데이터 추출 */
export function extractMeetupData(data: MeetupCreateFormData): MeetupCreateRequest {
	return {
		name: data.name,
		type: data.type,
		region: data.region,
		address: getAddress(data._addressName, data._addressDetail),
		latitude: data.latitude,
		longitude: data.longitude,
		dateTime: parseTimestamp(data._dateTime.date, data._dateTime.time) ?? "",
		registrationEnd: parseTimestamp(data._registrationEnd.date, data._registrationEnd.time) ?? "",
		capacity: data.capacity,
		image: data.image,
		description: data.description,
	} satisfies MeetupCreateRequest;
}
