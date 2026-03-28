import { Meeting } from "@/features/meetupDetail/types";
import { MeetupEditData } from "./types";

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
	return {
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
	};
}
