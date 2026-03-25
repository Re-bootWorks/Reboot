import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { KakaoAddressItem } from "../../types";
import { Modal } from "@/components/ui/Modals";
import FormStepProvider from "@/features/meetup/create/providers/FormStepProvider";
import FormDataProvider from "@/features/meetup/create/providers/FormDataProvider";
import { ToastProvider } from "@/providers/toast-provider";
import FormHeader from "./FormHeader";
import FormFooter from "./FormFooter";
import StepTypeSelect from "./StepTypeSelect";
import StepInfo from "./StepInfo";
import StepDesc from "./StepDesc";
import StepSchedule from "./StepSchedule";

const meta: Meta = {
	title: "Features/Meetup/Create/ModalSteps",
	parameters: {
		layout: "centered",
		nextjs: { appDirectory: true },
	},
};

export default meta;

type Story = StoryObj;

export const StepTypeSelectStory: Story = {
	name: "StepTypeSelect",
	render: () => (
		<ToastProvider>
			<StepStoryShell step={1}>
				<StepTypeSelect step={1} />
			</StepStoryShell>
		</ToastProvider>
	),
};

export const StepInfoStory: Story = {
	name: "StepInfo",
	render: () => (
		<ToastProvider>
			<StepStoryShell step={2}>
				<StepInfo
					step={2}
					uploadImageFn={mockUploadImage}
					getKakaoAddressFn={mockGetKakaoAddress}
				/>
			</StepStoryShell>
		</ToastProvider>
	),
};

export const StepDescStory: Story = {
	name: "StepDesc",
	render: () => (
		<ToastProvider>
			<StepStoryShell step={3}>
				<StepDesc step={3} />
			</StepStoryShell>
		</ToastProvider>
	),
};

export const StepScheduleStory: Story = {
	name: "StepSchedule",
	render: () => (
		<ToastProvider>
			<StepStoryShell step={4}>
				<StepSchedule step={4} />
			</StepStoryShell>
		</ToastProvider>
	),
};

function StepStoryShell({ step, children }: { step: number; children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(true);

	function handleSuccess(_id: number) {
		setIsOpen(false);
	}

	return (
		<FormStepProvider totalSteps={TOTAL_STEPS} step={step}>
			<FormDataProvider totalSteps={TOTAL_STEPS}>
				<Modal
					className="max-h-fit w-[342px] md:w-[544px]"
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					title={<FormHeader>{TITLE}</FormHeader>}
					footer={<FormFooter onClose={() => setIsOpen(false)} onSuccess={handleSuccess} />}>
					<form className="overflow-hidden">{children}</form>
				</Modal>
			</FormDataProvider>
		</FormStepProvider>
	);
}

const TITLE = "모임 만들기";
const TOTAL_STEPS = 4;

async function mockUploadImage(file: File): Promise<string> {
	return URL.createObjectURL(file);
}

async function mockGetKakaoAddress(_query: string): Promise<KakaoAddressItem[]> {
	return MOCK_KAKAO_DATA;
}

const MOCK_KAKAO_DATA: KakaoAddressItem[] = [
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
