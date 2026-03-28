"use client";

import { useEffect } from "react";
import { useFormData } from "../providers/FormDataProvider";
import CapacityField from "../../components/CapacityField";
import DateTimeField from "../../components/DateTimeField";
import { validateCapacity, validateDateTime } from "../../utils";

interface StepScheduleProps {
	/** 단계 숫자 */
	step: number;
}
export default function StepSchedule({ step }: StepScheduleProps) {
	const { setStepValid, setData, data } = useFormData();

	function handleChangeSchedule(
		key: typeof DATE_TIME_KEY | typeof REG_END_KEY,
		type: typeof DATE_KEY | typeof TIME_KEY,
		value: string,
	) {
		if (key === DATE_TIME_KEY) {
			setData((prev) => ({ ...prev, _dateTime: { ...prev._dateTime, [type]: value } }));
		}
		if (key === REG_END_KEY) {
			setData((prev) => ({
				...prev,
				_registrationEnd: { ...prev._registrationEnd, [type]: value },
			}));
		}
	}

	function handleChangeCapacity(value: number) {
		setData((prev) => ({ ...prev, capacity: value }));
	}

	// 데이터 유효성 검사
	useEffect(() => {
		const isDateTimeValid = validateDateTime(data._dateTime.date, data._dateTime.time);
		const isRegEndValid = validateDateTime(data._registrationEnd.date, data._registrationEnd.time);
		const isCapacityValid = validateCapacity(data.capacity);
		const isValid = isDateTimeValid && isRegEndValid && isCapacityValid;
		setStepValid(step, isValid);
	}, [data, setStepValid, step]);

	return (
		<fieldset className="flex flex-col gap-y-4 md:gap-y-6">
			<DateTimeField
				label="모임 일정"
				date={data._dateTime.date}
				time={data._dateTime.time}
				onDateChange={(v) => handleChangeSchedule(DATE_TIME_KEY, DATE_KEY, v)}
				onTimeChange={(v) => handleChangeSchedule(DATE_TIME_KEY, TIME_KEY, v)}
			/>
			<DateTimeField
				label="모집 마감 날짜"
				date={data._registrationEnd.date}
				time={data._registrationEnd.time}
				onDateChange={(v) => handleChangeSchedule(REG_END_KEY, DATE_KEY, v)}
				onTimeChange={(v) => handleChangeSchedule(REG_END_KEY, TIME_KEY, v)}
			/>
			<CapacityField name="capacity" value={data.capacity} onChange={handleChangeCapacity} />
		</fieldset>
	);
}
const DATE_TIME_KEY = "_dateTime";
const REG_END_KEY = "_registrationEnd";
const DATE_KEY = "date";
const TIME_KEY = "time";
