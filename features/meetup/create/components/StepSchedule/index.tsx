"use client";

import { useEffect } from "react";
import { useFormData, type MeetupCreateFormData } from "../../providers/FormDataProvider";
import CapacityField from "@/features/meetup/components/CapacityField";
import DateTimeField from "@/features/meetup/components/DateTimeField";
import { validateCapacity, validateDateTime, validateDateTimeOrder } from "../../../utils";
import { validateMaxCapacity } from "@/features/meetupDetail/edit/utils";
import { MIN_CONFIRMED_COUNT } from "@/features/meetupDetail/components/PersonnelContainer";
import { useToast } from "@/providers/toast-provider";

interface StepScheduleProps {
	/** 단계 숫자 */
	step: number;
}

export default function StepSchedule({ step }: StepScheduleProps) {
	const { setStepValid, setData, data } = useFormData();
	const { handleShowToast } = useToast();

	function handleChangeSchedule(
		key: typeof DATE_TIME_KEY | typeof REG_END_KEY,
		type: typeof DATE_KEY | typeof TIME_KEY,
		value: string,
	) {
		let next: MeetupCreateFormData | undefined;
		setData((prev) => {
			next =
				key === DATE_TIME_KEY
					? { ...prev, _dateTime: { ...prev._dateTime, [type]: value } }
					: { ...prev, _registrationEnd: { ...prev._registrationEnd, [type]: value } };
			return next;
		});
		if (!next) return;

		const { date: meetDate, time: meetTime } = next._dateTime;
		const { date: regDate, time: regTime } = next._registrationEnd;

		const badOrder =
			!!meetDate &&
			!!meetTime &&
			!!regDate &&
			!!regTime &&
			!validateDateTimeOrder({
				dateTime: next._dateTime,
				registrationEnd: next._registrationEnd,
			});

		if (key === DATE_TIME_KEY) {
			if (!meetDate || !meetTime) return;
			if (!validateDateTime(meetDate, meetTime)) {
				handleShowToast({ message: MESSAGE_SCHEDULE_AFTER_NOW, status: "error" });
				return;
			}
			if (badOrder) {
				handleShowToast({ message: MESSAGE_SCHEDULE_ORDER, status: "error" });
				return;
			}
		}
		if (key === REG_END_KEY) {
			if (!regDate || !regTime) return;
			if (!validateDateTime(regDate, regTime)) {
				handleShowToast({ message: MESSAGE_REGISTRATION_END_AFTER_NOW, status: "error" });
				return;
			}
			if (badOrder) {
				handleShowToast({ message: MESSAGE_SCHEDULE_ORDER, status: "error" });
				return;
			}
		}
	}

	function handleChangeCapacity(value: number) {
		setData((prev) => ({ ...prev, capacity: value }));
	}

	// 데이터 유효성 검사
	useEffect(() => {
		const isDateTimeValid = validateDateTime(data._dateTime.date, data._dateTime.time);
		const isRegEndValid = validateDateTime(data._registrationEnd.date, data._registrationEnd.time);
		const isDateTimeOrderValid = validateDateTimeOrder({
			dateTime: data._dateTime,
			registrationEnd: data._registrationEnd,
		});
		const isCapacityValid = validateCapacity(data.capacity);
		const isMaxCapacityValid = validateMaxCapacity(data.capacity, MIN_CONFIRMED_COUNT);
		setStepValid(
			step,
			isDateTimeValid &&
				isRegEndValid &&
				isDateTimeOrderValid &&
				isCapacityValid &&
				isMaxCapacityValid,
		);
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

const MESSAGE_SCHEDULE_AFTER_NOW = "모임 일정은 현재 시각 이후여야 합니다.";
const MESSAGE_REGISTRATION_END_AFTER_NOW = "모집 마감 날짜는 현재 시각 이후여야 합니다.";
const MESSAGE_SCHEDULE_ORDER = "모임 일정이 모집 마감 날짜보다 이전입니다.";
