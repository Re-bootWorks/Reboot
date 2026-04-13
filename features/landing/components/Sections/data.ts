import IcCheckBadge from "@/components/ui/icons/IcCheckBadge";
import IcPlugConnection from "@/components/ui/icons/IcPlugConnection";
import IcSparkle from "@/components/ui/icons/IcSparkle";
import { IconProps } from "@/utils/resolveIconAttr";
import { ComponentType } from "react";

export const PROBLEM_CARDS = [
	{
		title: "퇴근 후\n반복되는 일상",
		description: "매일 같은 루틴,\n뭔가 새로운 자극이 필요할 때",
		image: "/assets/img/img_work.svg",
		alt: "책상 앞에 앉아 일하는 이미지",
	},
	{
		title: "새로운 사람을\n만나기 어려운 환경",
		description: "같은 사람만 반복,\n인연의 폭을 넓히고 싶을 때",
		image: "/assets/img/img_gray_people.svg",
		alt: "사람들이 모여 있는 이미지",
	},
	{
		title: "시작하고 싶지만\n혼자라 망설이는 순간",
		description: "함께할 사람만 있다면\n자신감과 함께 시작할 수 있을 때",
		image: "/assets/img/img_with_sofa.svg",
		alt: "소파에 앉아 있는 이미지",
	},
];

export const SOLUTION_ITEMS = [
	{
		title: "다양한 관심사",
		description: "자기계발부터 취미까지, 당신의 관심사에 맞는 모임을 찾아보세요",
		icon: IcSparkle,
	},
	{
		title: "쉽게 참여",
		description: "복잡한 절차 없이 클릭 한 번으로 모든 모임에 참여할 수 있습니다",
		icon: IcCheckBadge,
	},
	{
		title: "자연스러운 연결",
		description: "같은 관심사를 가진 사람들과 자연스럽게 관계를 만들어가세요",
		icon: IcPlugConnection,
	},
];

export interface CategoryItem {
	title: string;
	tags: string[];
	icon: ComponentType<IconProps>;
	cardClassName: string;
	tagClassName: string;
}

export const CATEGORIES = [
	{
		title: "자기 계발",
		tags: ["#역량향상", "#취업성공"],
		icon: IcSparkle,
		cardClassName: "bg-purple-100",
		tagClassName: "border-purple-600 text-purple-600",
	},
	{
		title: "운동 • 스포츠",
		tags: ["#체력관리", "#다이어트"],
		icon: IcSparkle,
		cardClassName: "bg-green-100",
		tagClassName: "border-green-600 text-green-600",
	},
	{
		title: "문화생활",
		tags: ["#감성충전", "#덕질친구"],
		icon: IcSparkle,
		cardClassName: "bg-pink-100",
		tagClassName: "border-[#BE185D] text-[#BE185D]",
	},
	{
		title: "여행",
		tags: ["#일상탈출", "#맛집투어"],
		icon: IcSparkle,
		cardClassName: "bg-[#E0F2FE]",
		tagClassName: "border-[#0369A1] text-[#0369A1]",
	},
	{
		title: "반려동물",
		tags: ["#산책친구", "#자랑대회"],
		icon: IcSparkle,
		cardClassName: "bg-[#FEF3C7]",
		tagClassName: "border-[#B45309] text-[#B45309]",
	},
	{
		title: "기타",
		tags: ["#일상공유", "#봉사활동"],
		icon: IcSparkle,
		cardClassName: "bg-[#F1F5F9]",
		tagClassName: "border-[#334155] text-[#334155]",
	},
];

export const HOW_IT_WORKS_STEPS = [
	{
		id: 1,
		label: "모임 찾기",
		title: "원하는 모임을 찾고",
		description: "다양한 관심사와 취미를 공유하는 모임을 탐색하세요",
		image: "/assets/img/img_how_it_works_01.png",
		alt: "모임찾기 페이지 이미지",
	},
	{
		id: 2,
		label: "일정 확인",
		title: "내 일정에 맞춰 고르고",
		description: "시간, 지역, 카테고리를 보고 지금 참여할 수 있는 모임을 확인하세요",
		image: "/assets/img/img_how_it_works_02.png",
		alt: "모임 상세 페이지 이미지",
	},
	{
		id: 3,
		label: "간편 참여",
		title: "가볍게 신청하고",
		description: "복잡한 과정 없이 원하는 모임에 빠르게 참여할 수 있어요",
		image: "/assets/img/img_how_it_works_03.png",
		alt: "찜한 모임 페이지 이미지",
	},
	{
		id: 4,
		label: "함께 경험",
		title: "사람들과 연결되고",
		description: "비슷한 관심사를 가진 사람들과 자연스럽게 어울릴 수 있어요",
		image: "/assets/img/img_how_it_works_04.png",
		alt: "모든 리뷰 페이지 이미지",
	},
	{
		id: 5,
		label: "다음 모임",
		title: "새로운 일상을 이어가요",
		description: "한 번의 참여로 끝나지 않고 다음 만남까지 계속 이어집니다",
		image: "/assets/img/img_how_it_works_05.png",
		alt: "자유게시판 페이지 이미지",
	},
];

export const TESTIMONIALS = [
	{
		name: "보보",
		date: "2024.01.25",
		content: "처음 만난 분들과도 금세 친해질 수 있었어요. 웃고 떠들다 보니 시간이 금방 갔습니다.",
		profileImage: "/assets/img/img_profile_boy.svg",
	},
	{
		name: "헛차헛차",
		date: "2024.05.31",
		content: "혼자였다면 끝까지 못 했을 텐데, 같이 하니 꾸준히 운동할 수 있었어요.",
		profileImage: "/assets/img/img_profile_girl.svg",
	},
	{
		name: "암쿡",
		date: "2024.07.21",
		content: "같이 재료를 손질하고 조리해서 분위기가 화기애애했어요!",
		profileImage: "/assets/img/img_profile.svg",
	},
	{
		name: "말차좋아",
		date: "2024.08.08",
		content: "평소 혼자 가던 카페도 함께 다니니 더 재미있고 보람찼어요 ~",
		profileImage: "/assets/img/img_profile_boy.svg",
	},
	{
		name: "beme",
		date: "2024.04.14",
		content: "다른 부모님들과의 교류가 활발했어요. 오랜만에 소중한 추억을 만들었네요 :)",
		profileImage: "/assets/img/img_profile_girl.svg",
	},
];
