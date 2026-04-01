import { ComponentProps } from "react";
import InputField from "../../Inputs/InputField";

export type DatePickerProps = Omit<
	ComponentProps<typeof InputField>,
	"type" | "value" | "defaultValue" | "onChange" | "leftIcon" | "rightIcon" | "onRightIconClick"
> & {
	value?: string;
	onChange?: (value: string) => void;
};
