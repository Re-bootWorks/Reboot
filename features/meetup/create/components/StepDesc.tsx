import InputField from "@/components/ui/Inputs/InputField";
import { useFormData } from "../providers/FormDataProvider";

interface StepDescProps {
	/** 단계 숫자 */
	step: number;
}
export default function StepDesc({ step }: StepDescProps) {
	const { data, setData, setStepValid } = useFormData();

	function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setData((prev) => ({ ...prev, [name]: value }));
		setStepValid(step, !!value.trim());
	}

	return (
		<fieldset>
			<InputField
				name="description"
				label="모임 설명"
				placeholder="모임을 설명해주세요"
				isRequired
				value={data.description}
				onChange={handleChangeInput}
			/>
		</fieldset>
	);
}
