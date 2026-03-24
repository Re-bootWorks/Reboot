"use client";

import { Modal } from "@/components/ui/Modals";
import { cn } from "@/utils/cn";
import { KakaoAddressItem, MeetupCreateData } from "../types";
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
	<StepInfo key="info" step={2} uploadImageFunc={uploadImage} kakaoAddressFunc={kakaoAddress} />,
	<StepDesc key="desc" step={3} />,
	<StepSchedule key="schedule" step={4} />,
];

async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
	// TODO: 이미지 업로드 처리(파일 분리)
	const file = e.target.files?.[0];
	if (file) {
		const url = URL.createObjectURL(file);
		return url;
	} else return "";
}

async function kakaoAddress() {
	// TODO: 외부 API 연동 및 드롭다운 목록 표시(파일 분리)
	return MOCK_DATA;
}
const MOCK_DATA: KakaoAddressItem[] = [
	{
		address: {
			address_name: "서울 강남구 역삼동 825",
			b_code: "1168010100",
			h_code: "1168064000",
			main_address_no: "825",
			mountain_yn: "N",
			region_1depth_name: "서울",
			region_2depth_name: "강남구",
			region_3depth_h_name: "역삼1동",
			region_3depth_name: "역삼동",
			sub_address_no: "",
			x: "127.028578846319",
			y: "37.4978399531903",
		},
		address_name: "서울 강남구 강남대로 390",
		address_type: "ROAD_ADDR",
		road_address: {
			address_name: "서울 강남구 강남대로 390",
			building_name: "미진프라자",
			main_building_no: "390",
			region_1depth_name: "서울",
			region_2depth_name: "강남구",
			region_3depth_name: "역삼동",
			road_name: "강남대로",
			sub_building_no: "",
			underground_yn: "N",
			x: "127.028578846319",
			y: "37.4978399531903",
			zone_no: "06232",
		},
		x: "127.028578846319",
		y: "37.4978399531903",
	},
];
