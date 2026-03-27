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
import imgDefault from "@/public/assets/img/img_empty.svg";
import { useCategoryStore, type CategoryName } from "@/store/category.store";
import type { StaticImageData } from "next/image";

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
				{categories.map((type) => (
					<motion.div
						key={type.id}
						variants={{
							hidden: { opacity: 0, y: 10 },
							visible: { opacity: 1, y: 0 },
						}}>
						<CategoryTab
							title={type.name}
							imageSrc={CATEGORY_IMAGES[type.name] ?? imgDefault}
							name="type"
							value={type.name}
							checked={data.type === type.name}
							onChange={handleChangeInput}
						/>
					</motion.div>
				))}
			</motion.div>
		</fieldset>
	);
}

const DESC = "이 모임은 어떤 종류인가요?";
const CATEGORY_IMAGES = {
	자기계발: imgStudy,
	"운동/스포츠": imgSports,
	문화생활: imgHobby,
	여행: imgBusiness,
	반려동물: imgFamily,
	기타: imgEtc,
} satisfies Record<CategoryName, StaticImageData>;
