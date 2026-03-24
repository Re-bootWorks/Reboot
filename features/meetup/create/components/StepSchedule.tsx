"use client";

import { useEffect, useState } from "react";
import { parseTimestamp } from "@/utils/date";
import { useFormData } from "../providers/FormDataProvider";
import InputField from "@/components/ui/Inputs/InputField";
import { InputFieldWrapper } from "@/components/ui/Inputs/InputFieldWrapper";
import DatePicker from "@/components/ui/Pickers/DatePicker";
import TimePicker from "@/components/ui/Pickers/TimePicker";

interface StepScheduleProps {
	/** 단계 숫자 */
	step: number;
}
type DateTime = {
	date: string;
	time: string;
};
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
		const isDateTimeValid = !!(dateTime.date && dateTime.time);
		const isRegEndValid = !!(regEnd.date && regEnd.time);
		const isCapacityValid = capacity > 0;
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
			<InputFieldWrapper label="모임 일정" isRequired>
				{({ id }) => (
					<div role="group" aria-labelledby={id} className="flex gap-x-3 md:gap-x-3">
						<DatePicker
							id={id}
							name="dateTimeDate"
							placeholder="YYYY-MM-DD"
							isRequired
							onChange={(v) => handleChangeSchedule(DATE_TIME_KEY, DATE_KEY, v)}
							value={dateTime.date}
							aria-labelledby={id}
						/>
						<TimePicker
							name="dateTimeTime"
							placeholder="00 : 00"
							isRequired
							onChange={(v) => handleChangeSchedule(DATE_TIME_KEY, TIME_KEY, v)}
							value={dateTime.time}
							aria-labelledby={id}
						/>
					</div>
				)}
			</InputFieldWrapper>
			<InputFieldWrapper label="모집 마감 날짜" isRequired>
				{({ id }) => (
					<div role="group" aria-labelledby={id} className="flex gap-x-3 md:gap-x-3">
						<DatePicker
							id={id}
							name="regEndDate"
							placeholder="YYYY-MM-DD"
							isRequired
							onChange={(v) => handleChangeSchedule(REG_END_KEY, DATE_KEY, v)}
							value={regEnd.date}
							aria-labelledby={id}
						/>
						<TimePicker
							name="regEndTime"
							placeholder="00 : 00"
							isRequired
							onChange={(v) => handleChangeSchedule(REG_END_KEY, TIME_KEY, v)}
							value={regEnd.time}
							aria-labelledby={id}
						/>
					</div>
				)}
			</InputFieldWrapper>
			<InputField
				name="capacity"
				label="모임 정원"
				placeholder="숫자만 입력해주세요"
				type="number"
				className="mt-8 md:mt-12"
				isRequired
				onChange={(e) => setCapacity(Number(e.target.value))}
			/>
		</fieldset>
	);
}
const DATE_TIME_KEY = "dateTime";
const REG_END_KEY = "regEnd";
const DATE_KEY = "date";
const TIME_KEY = "time";
