"use client";

import { Modal } from "@/components/ui/Modals";
import { cn } from "@/utils/cn";
import { MeetupCreateData } from "../types";
import { getKakaoAddress, uploadImage } from "../../apis";
import FormStepProvider, { useFormStep } from "../providers/FormStepProvider";
import FormDataProvider from "../providers/FormDataProvider";
import FormHeader from "./FormHeader";
import FormFooter from "./FormFooter";
import StepTypeSelect from "./StepTypeSelect";
import StepInfo from "./StepInfo";
import StepSchedule from "./StepSchedule";
import StepDesc from "./StepDesc";

interface CreateModalProps {
	/** 모달 열기 상태 */
	isOpen: boolean;
	/** 모달 닫기 시 호출 */
	onClose: () => void;
	/** 제출 버튼 클릭 시 호출 */
	onSubmit: (data: MeetupCreateData) => Promise<void>;
	/** 제출 버튼 로딩 상태 */
	isPending: boolean;
}
export type OnSubmit = (data: MeetupCreateData) => Promise<void>;

export default function CreateModal({ isOpen, onClose, onSubmit, isPending }: CreateModalProps) {
	return (
		<FormStepProvider isOpen={isOpen} totalSteps={TOTAL_STEPS}>
			<FormDataProvider isOpen={isOpen} totalSteps={TOTAL_STEPS}>
				<CreateForm isOpen={isOpen} onClose={onClose} onSubmit={onSubmit} isPending={isPending} />
			</FormDataProvider>
		</FormStepProvider>
	);
}

function CreateForm({ isOpen, onClose, onSubmit, isPending }: CreateModalProps) {
	const { currentStep } = useFormStep();

	return (
		<Modal
			className="max-h-fit w-[342px] md:w-[544px]"
			isOpen={isOpen}
			onClose={onClose}
			title={<FormHeader>{TITLE}</FormHeader>}
			footer={<FormFooter onClose={onClose} isPending={isPending} onSubmit={onSubmit} />}>
			<form className="overflow-hidden">
				{STEP_COMPS.map((Comp) => {
					const isInvisible = Comp.props.step !== currentStep;
					return (
						<div
							className={cn("w-full shrink-0", isInvisible && "h-0 overflow-hidden")}
							key={Comp.key}>
							{Comp}
						</div>
					);
				})}
			</form>
		</Modal>
	);
}

const TITLE = "모임 만들기";
const TOTAL_STEPS = 4;
const STEP_COMPS = [
	<StepTypeSelect key="type" step={1} />,
	<StepInfo key="info" step={2} uploadImageFn={uploadImage} getKakaoAddressFn={getKakaoAddress} />,
	<StepDesc key="desc" step={3} />,
	<StepSchedule key="schedule" step={4} />,
];
