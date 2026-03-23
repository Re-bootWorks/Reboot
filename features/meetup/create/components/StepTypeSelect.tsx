"use client";

import { motion } from "motion/react";
import CategoryTab from "@/components/ui/CategoryTab";
import { useFormData } from "../providers/FormDataProvider";
import imgHobby from "../assets/img_hobby.png";
import imgStudy from "../assets/img_study.png";
import imgBusiness from "../assets/img_business.png";
import imgSports from "../assets/img_sports.png";
import imgFamily from "../assets/img_family.png";
import imgEtc from "../assets/img_etc.png";

interface StepTypeSelectProps {
	/** 단계 숫자 */
	step: number;
}
export default function StepTypeSelect({ step }: StepTypeSelectProps) {
	const { data, setData, setStepValid } = useFormData();

	function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setData((prev) => ({ ...prev, [name]: value }));
		setStepValid(step, true);
	}

	return (
		<fieldset>
			<legend className="mb-5 block w-full text-gray-800">
				{DESC}
				<span className="ml-0.5 text-purple-500">*</span>
			</legend>
			<motion.div
				className="grid grid-cols-2 justify-items-center gap-5 md:grid-cols-3"
				initial="hidden"
				animate="visible"
				variants={{
					visible: { transition: { staggerChildren: 0.05 } },
				}}>
				{TYPES.map((type) => (
					<motion.div
						key={type.value}
						variants={{
							hidden: { opacity: 0, y: 10 },
							visible: { opacity: 1, y: 0 },
						}}>
						<CategoryTab
							title={type.name}
							imageSrc={type.imageSrc}
							name="type"
							value={type.value}
							checked={data.type === type.value}
							onChange={handleChangeInput}
						/>
					</motion.div>
				))}
			</motion.div>
		</fieldset>
	);
}

const DESC = "이 모임은 어떤 종류인가요?";
const TYPES = [
	{ value: "hobby", name: "취미/여가", imageSrc: imgHobby },
	{ value: "study", name: "스터디", imageSrc: imgStudy },
	{ value: "business", name: "비즈니스", imageSrc: imgBusiness },
	{ value: "sports", name: "운동/건강", imageSrc: imgSports },
	{ value: "family", name: "가족/육아", imageSrc: imgFamily },
	{ value: "etc", name: "기타", imageSrc: imgEtc },
];
