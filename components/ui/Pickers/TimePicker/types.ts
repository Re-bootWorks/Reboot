import { ComponentProps } from "react";
import InputField from "../../Inputs/InputField";

export type TimePickerProps = Omit<
	ComponentProps<typeof InputField>,
	"type" | "value" | "defaultValue" | "onChange" | "leftIcon" | "rightIcon" | "onRightIconClick"
> & {
	value?: string;
	onChange?: (value: string) => void;
};

export type TimeValue = {
	hour: string;
	minute: string;
};

export type TimeListboxProps = {
	label: string;
	unit: string;
	value?: string;
	options: string[];
	onChange: (value: string) => void;
};
