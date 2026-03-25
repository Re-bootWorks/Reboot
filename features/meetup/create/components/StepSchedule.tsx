"use client";

import { useEffect, useState } from "react";
import { parseTimestamp } from "@/utils/date";
import { validateCapacity, validateDateTime } from "../../utils";
import { useFormData } from "../providers/FormDataProvider";
import CapacityField from "../../components/CapacityField";
import DateTimeField, { DateTime } from "../../components/DateTimeField";

interface StepScheduleProps {
	/** 단계 숫자 */
	step: number;
}
export default function StepSchedule({ step }: StepScheduleProps) {
	const { setStepValid, setData } = useFormData();
	const [dateTime, setDateTime] = useState<DateTime>({ date: "", time: "" });
	const [regEnd, setRegEnd] = useState<DateTime>({ date: "", time: "" });
	const [capacity, setCapacity] = useState<number>(0);

	function handleChangeSchedule(
		key: typeof DATE_TIME_KEY | typeof REG_END_KEY,
		type: typeof DATE_KEY | typeof TIME_KEY,
		value: string,
	) {
		if (key === DATE_TIME_KEY) {
			setDateTime((prev) => ({ ...prev, [type]: value }));
		}
		if (key === REG_END_KEY) {
			setRegEnd((prev) => ({ ...prev, [type]: value }));
		}
	}

	// 유효성 검사
	useEffect(() => {
		const isDateTimeValid = validateDateTime(dateTime.date, dateTime.time);
		const isRegEndValid = validateDateTime(regEnd.date, regEnd.time);
		const isCapacityValid = validateCapacity(capacity);
		const isValid = isDateTimeValid && isRegEndValid && isCapacityValid;

		setStepValid(step, isValid);
	}, [step, dateTime, regEnd, capacity, setStepValid]);

	// 실시간 변환 및 데이터 저장
	useEffect(() => {
		setData((prev) => ({
			...prev,
			capacity,
			dateTime: parseTimestamp(dateTime.date, dateTime.time) ?? prev.dateTime,
			registrationEnd: parseTimestamp(regEnd.date, regEnd.time) ?? prev.registrationEnd,
		}));
	}, [dateTime, regEnd, capacity, setData]);

	return (
		<fieldset className="flex flex-col gap-y-4 md:gap-y-6">
			<DateTimeField
				label="모임 일정"
				date={dateTime.date}
				time={dateTime.time}
				onDateChange={(v) => handleChangeSchedule(DATE_TIME_KEY, DATE_KEY, v)}
				onTimeChange={(v) => handleChangeSchedule(DATE_TIME_KEY, TIME_KEY, v)}
			/>
			<DateTimeField
				label="모집 마감 날짜"
				date={regEnd.date}
				time={regEnd.time}
				onDateChange={(v) => handleChangeSchedule(REG_END_KEY, DATE_KEY, v)}
				onTimeChange={(v) => handleChangeSchedule(REG_END_KEY, TIME_KEY, v)}
			/>
			<CapacityField name="capacity" value={capacity} onChange={setCapacity} />
		</fieldset>
	);
}
const DATE_TIME_KEY = "dateTime";
const REG_END_KEY = "regEnd";
const DATE_KEY = "date";
const TIME_KEY = "time";
