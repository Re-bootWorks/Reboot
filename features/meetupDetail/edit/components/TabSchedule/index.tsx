"use client";

import DateTimeField from "@/features/meetup/components/DateTimeField";
import CapacityField from "@/features/meetup/components/CapacityField";
import { formatIsoDateToInput, parseTimestamp, uiFormatTime } from "@/utils/date";
import { useEditFormData } from "@/features/meetupDetail/edit/providers/EditFormDataProvider";

export default function TabSchedule() {
	const { setData, data } = useEditFormData();

	const handleDateTimeChange = (
		field: "dateTime" | "registrationEnd",
		type: "date" | "time",
		value: string,
	) => {
		const currentFullDate = data[field];
		const currentDate = formatIsoDateToInput(currentFullDate);
		const currentTime = uiFormatTime(currentFullDate);

		const newDate = type === "date" ? value : currentDate;
		const newTime = type === "time" ? value : currentTime;
		const nextIsoString = parseTimestamp(newDate, newTime);

		if (nextIsoString) {
			setData((prev) => ({ ...prev, [field]: nextIsoString }));
		}
	};

	return (
		<fieldset className="flex flex-col gap-y-4 md:gap-y-6">
			<DateTimeField
				label="모임 일정"
				date={formatIsoDateToInput(data.dateTime)}
				time={uiFormatTime(data.dateTime)}
				onDateChange={(v) => handleDateTimeChange("dateTime", "date", v)}
				onTimeChange={(v) => handleDateTimeChange("dateTime", "time", v)}
			/>
			<DateTimeField
				label="모집 마감 날짜"
				date={formatIsoDateToInput(data.registrationEnd)}
				time={uiFormatTime(data.registrationEnd)}
				onDateChange={(v) => handleDateTimeChange("registrationEnd", "date", v)}
				onTimeChange={(v) => handleDateTimeChange("registrationEnd", "time", v)}
			/>
			<CapacityField
				name="capacity"
				value={data.capacity}
				onChange={(value) => setData((prev) => ({ ...prev, capacity: value }))}
			/>
		</fieldset>
	);
}
