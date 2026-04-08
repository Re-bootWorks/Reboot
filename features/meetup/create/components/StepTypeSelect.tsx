"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import type { StaticImageData } from "next/image";
import { useCategoryStore, type CategoryName } from "@/store/category.store";
import { useFormData } from "../providers/FormDataProvider";
import { validateText } from "../../utils";
import CategoryTab from "@/components/ui/CategoryTab";
import imgDefault from "@/public/assets/img/img_empty.svg";
import imgGrowth from "../assets/img_growth.svg";
import imgFitness from "../assets/img_fitness.svg";
import imgCulture from "../assets/img_culture.svg";
import imgTravel from "../assets/img_travel.svg";
import imgPets from "../assets/img_pets.svg";
import imgVibes from "../assets/img_vibes.svg";

interface StepTypeSelectProps {
	/** 단계 숫자 */
	step: number;
}
export default function StepTypeSelect({ step }: StepTypeSelectProps) {
	const { categories } = useCategoryStore();
	const { data, setData, setStepValid } = useFormData();

	function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setData((prev) => ({ ...prev, [name]: value }));
	}

	// 유효성 검사
	useEffect(() => {
		if (validateText(data.type)) {
			setStepValid(step, true);
		}
	}, [data.type, setStepValid, step]);

	return (
		<fieldset>
			<legend className="mb-5 block w-full text-gray-800">
				{DESC}
				<span className="ml-0.5 text-purple-500">*</span>
			</legend>
			<div className="grid grid-cols-2 justify-items-center gap-5 md:grid-cols-3">
				{categories.map((type, index) => (
					<motion.div
						key={type.id}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.3,
							delay: index * 0.06,
							ease: "easeOut",
						}}>
						<CategoryTab
							title={type.name}
							imageSrc={categoryImages[type.name] ?? imgDefault}
							name="type"
							value={type.name}
							checked={data.type === type.name}
							onChange={handleChangeInput}
						/>
					</motion.div>
				))}
			</div>
		</fieldset>
	);
}

const DESC = "이 모임은 어떤 종류인가요?";
const categoryImages = {
	자기계발: imgGrowth,
	"운동/스포츠": imgFitness,
	문화생활: imgCulture,
	여행: imgTravel,
	반려동물: imgPets,
	기타: imgVibes,
} satisfies Record<CategoryName, StaticImageData>;
