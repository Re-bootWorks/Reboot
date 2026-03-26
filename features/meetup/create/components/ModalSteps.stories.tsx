import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { KakaoPlaceItem, KakaoPlaceResponse } from "../../types";
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
				<StepInfo step={2} uploadImageFn={mockUploadImage} getKakaoPlaceFn={mockgetKakaoPlace} />
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

async function mockgetKakaoPlace(_query: string): Promise<KakaoPlaceItem[]> {
	const { documents } = MOCK_KAKAO_DATA;
	return documents;
}

const MOCK_KAKAO_DATA: KakaoPlaceResponse = {
	documents: [
		{
			address_name: "서울 용산구 후암동 168",
			category_group_code: "",
			category_group_name: "",
			category_name: "사회,공공기관 > 행정기관 > 교육부 > 교육청",
			distance: "",
			id: "7933595",
			phone: "02-1396",
			place_name: "서울특별시교육청",
			place_url: "http://place.map.kakao.com/7933595",
			road_address_name: "서울 용산구 두텁바위로 27",
			x: "126.9756819915084",
			y: "37.546379996131755",
		},
		{
			address_name: "서울 용산구 후암동 30-84",
			category_group_code: "",
			category_group_name: "",
			category_name: "교육,학문 > 학습시설 > 도서관",
			distance: "",
			id: "17806970",
			phone: "02-754-7338",
			place_name: "서울특별시교육청 남산도서관",
			place_url: "http://place.map.kakao.com/17806970",
			road_address_name: "서울 용산구 소월로 109",
			x: "126.98134963959883",
			y: "37.553003366396936",
		},
		{
			address_name: "서울 용산구 후암동 30-90",
			category_group_code: "",
			category_group_name: "",
			category_name: "교육,학문 > 학습시설 > 도서관",
			distance: "",
			id: "8472480",
			phone: "02-6902-7777",
			place_name: "서울특별시교육청 용산도서관",
			place_url: "http://place.map.kakao.com/8472480",
			road_address_name: "서울 용산구 두텁바위로 160",
			x: "126.980145783584",
			y: "37.5519886462656",
		},
		{
			address_name: "서울 용산구 후암동 30-84",
			category_group_code: "PK6",
			category_group_name: "주차장",
			category_name: "교통,수송 > 교통시설 > 주차장 > 공영주차장",
			distance: "",
			id: "23371132",
			phone: "",
			place_name: "서울특별시교육청 남산도서관 주차장",
			place_url: "http://place.map.kakao.com/23371132",
			road_address_name: "서울 용산구 소월로 109",
			x: "126.98180228755753",
			y: "37.553129576746215",
		},
		{
			address_name: "서울 중구 회현동1가 100-177",
			category_group_code: "",
			category_group_name: "",
			category_name: "사회,공공기관 > 행정기관 > 교육부",
			distance: "",
			id: "18756201",
			phone: "02-311-1209",
			place_name: "서울특별시교육청 교육연구정보원",
			place_url: "http://place.map.kakao.com/18756201",
			road_address_name: "서울 중구 소파로 46",
			x: "126.981190831169",
			y: "37.5544791757558",
		},
		{
			address_name: "서울 중구 회현동1가 산 1-2",
			category_group_code: "CT1",
			category_group_name: "문화시설",
			category_name: "문화,예술 > 문화시설 > 과학관",
			distance: "",
			id: "10155812",
			phone: "02-311-1276",
			place_name: "서울특별시교육청융합과학교육원 남산분원",
			place_url: "http://place.map.kakao.com/10155812",
			road_address_name: "서울 중구 소파로 46",
			x: "126.98094182272717",
			y: "37.55459806753188",
		},
		{
			address_name: "서울 종로구 화동 2",
			category_group_code: "",
			category_group_name: "",
			category_name: "교육,학문 > 학습시설 > 도서관",
			distance: "",
			id: "13028509",
			phone: "02-2011-5799",
			place_name: "서울특별시교육청 정독도서관",
			place_url: "http://place.map.kakao.com/13028509",
			road_address_name: "서울 종로구 북촌로5길 48",
			x: "126.982995455867",
			y: "37.5814300334622",
		},
		{
			address_name: "서울 종로구 사직동 1-28",
			category_group_code: "",
			category_group_name: "",
			category_name: "교육,학문 > 학습시설 > 도서관",
			distance: "",
			id: "8521095",
			phone: "02-721-0707",
			place_name: "서울특별시교육청종로도서관",
			place_url: "http://place.map.kakao.com/8521095",
			road_address_name: "서울 종로구 사직로9길 15-14",
			x: "126.966491286462",
			y: "37.5764349954241",
		},
	],
	meta: {
		is_end: false,
		pageable_count: 45,
		same_name: {
			keyword: "서울특별시교육청",
			region: [],
			selected_region: "",
		},
		total_count: 112,
	},
};
