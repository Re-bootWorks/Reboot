import { useFormData } from "../providers/FormDataProvider";
import DescField from "../../components/DescField";
import { validateText } from "../../utils";

interface StepDescProps {
	/** 단계 숫자 */
	step: number;
}
export default function StepDesc({ step }: StepDescProps) {
	const { data, setData, setStepValid } = useFormData();

	function handleChangeInput(_: string, e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setData((prev) => ({ ...prev, [name]: value }));
		setStepValid(step, validateText(value));
	}

	return (
		<fieldset>
			<DescField name="description" value={data.description} onChange={handleChangeInput} />
		</fieldset>
	);
}
