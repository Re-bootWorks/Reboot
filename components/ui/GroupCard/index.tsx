"use client";

import { createContext, useContext } from "react";
import NextImage, { type ImageProps } from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { cn } from "@/utils/cn";
import { IcLocation, IcPerson } from "../icons";
import { StatusLabel } from "../StatusLabel";
import { DeadlineTag } from "../Tags/DeadlineTag";
import { TimeTag } from "../Tags/TimeTag";
import ProgressBar from "../ProgressBar";
import Button from "../Buttons/Button";
import UtilityButton from "../Buttons/UtilityButton";
import ImgRibbon from "./assets/img_ribbon.svg";

interface GroupCardStatus {
	/** 개설 확정 여부(confirmedAt) */
	isConfirmed: boolean;
	/** 모집 마감 여부(registrationEnd, participantCount >= capacity) */
	isRegClosed: boolean;
	/** 사용자의 찜 여부 */
	isLiked: boolean;
	/** 사용자의 참여 여부 */
	isJoined: boolean;
	/** 모임 완료 여부 */
	isCompleted?: boolean;
}
interface GroupCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
	/** 모임 ID */
	id: number;
	/** 클릭 시 이동할 링크 경로 */
	href: string;
	/** 모임 상태 */
	status: Prettify<GroupCardStatus>;
	/** 자식 컴포넌트 */
	children: React.ReactNode;
	/** 컴포넌트 추가 클래스 */
	className?: string;
}
type Prettify<T> = { [K in keyof T]: T[K] } & {};

function GroupCard({ id, href, status, children, className, ...props }: GroupCardProps) {
	return (
		<GroupCardContext.Provider value={status}>
			<div
				data-groupid={id}
				className={cn(
					"relative isolate flex flex-col transition-shadow duration-300 hover:shadow-md md:flex-row md:gap-x-5 md:p-6",
					containerStyle,
					className,
				)}
				{...props}>
				{status.isJoined && (
					<div className="transform-origin-center pointer-events-none absolute -top-1 -left-8.5 z-2 aspect-616/174 w-36 translate-y-1/2 -rotate-45">
						<span className="absolute top-1/2 left-1/2 z-2 -translate-x-1/2 -translate-y-3/5 leading-10 font-bold tracking-widest text-white">
							참여 모임
						</span>
						<NextImage
							src={ImgRibbon}
							fill
							sizes="(max-width: 616px) 100vw, 616px"
							alt="참여 완료"
						/>
					</div>
				)}
				<Link href={href} className="absolute inset-0 z-1" />
				{children}
			</div>
		</GroupCardContext.Provider>
	);
}
const containerStyle = "h-[346px] min-w-[343px] md:h-[219px] w-full rounded-4xl bg-white";

function GroupCardSkeleton() {
	return (
		<div className={containerStyle}>
			<Skeleton
				height="100%"
				containerClassName="block h-full w-full leading-none"
				borderRadius={0}
			/>
		</div>
	);
}

interface GroupCardImageProps {
	/** 이미지 경로 */
	src?: ImageProps["src"] | null;
	/** 이미지 대체 텍스트 */
	alt: string;
}
function Image({ src, alt }: GroupCardImageProps) {
	const { isRegClosed, isCompleted } = useGroupCard();
	const hasSrc = !!src;

	// 모집 마감 또는 모임 완료 시 오버레이 추가
	return (
		<div className="relative flex h-full items-center justify-center overflow-hidden md:h-[170px] md:w-[170px] md:rounded-3xl">
			{isRegClosed && (
				<>
					<span className="font-taenada pointer-events-none absolute top-1/2 left-1/2 z-2 -translate-x-1/2 -translate-y-1/2 text-2xl font-extrabold whitespace-nowrap text-white select-none">
						{isCompleted ? "모임 완료" : isRegClosed ? "모집 마감" : ""}
					</span>
					<div
						className="pointer-events-none absolute inset-0 z-1 rounded-t-3xl bg-black tracking-[-0.72px] opacity-70"
						aria-hidden="true"
					/>
				</>
			)}
			<NextImage
				src={src || "/assets/img/img_empty_purple.svg"}
				alt={alt}
				fill
				sizes="(max-width: 744px) 100vw, 170px"
				className={cn(hasSrc ? "object-cover" : "bg-purple-50 object-scale-down", "rounded-t-3xl")}
			/>
		</div>
	);
}

interface ContentProp {
	/** 이미지 외의 자식 요소 */
	children: React.ReactNode;
}
function Content({ children }: ContentProp) {
	return (
		<div
			className={cn(
				"grid flex-1 px-4 py-4.5 md:px-0 md:py-2",
				"grid-cols-[1fr_auto]",
				"md:grid-rows-[auto_auto_1fr_auto]",
				"[grid-template-areas:'title_title'_'subtitle_subtitle'_'badge-group_badge-group'_'participant-bar_join-button']",
				"md:[grid-template-areas:'title_title'_'subtitle_subtitle'_'._.'_'badge-group_join-button'_'participant-bar_join-button']",
			)}>
			{children}
		</div>
	);
}

interface TitleProp {
	/** 모임 이름 */
	name: string;
}
function Title({ name }: TitleProp) {
	const { isConfirmed } = useGroupCard();

	// 개설 확정 시 배지 추가
	return (
		<div className="mb-1.5 flex items-center gap-x-2 overflow-hidden [grid-area:title] md:mr-16">
			<span className="min-w-0 truncate text-xl font-semibold text-gray-800">{name}</span>
			{isConfirmed && <StatusLabel>개설 확정</StatusLabel>}
		</div>
	);
}

interface SubTitleProp {
	/** 모임 위치 */
	region: string;
	/** 모임 종류 */
	type: string;
}
function SubTitle({ region, type }: SubTitleProp) {
	return (
		<div className="mb-3.5 flex items-center gap-x-0.5 text-sm text-gray-600 [grid-area:subtitle] md:mb-0">
			<IcLocation />
			{region}
			<span>·</span>
			<span>{type}</span>
		</div>
	);
}

interface BadgeGroupProp {
	/** 모임 일시 */
	date: string;
	/** 모임 시간 */
	time: string;
	/** 모집 마감 텍스트: 오늘 nn시 마감 | n일 후 마감 */
	deadlineText?: string;
}
function BadgeGroup({ date, time, deadlineText }: BadgeGroupProp) {
	return (
		<div className="mb-5.5 flex items-center gap-x-1.5 [grid-area:badge-group] md:mb-4">
			<TimeTag>{date}</TimeTag>
			<TimeTag>{time}</TimeTag>
			{deadlineText && <DeadlineTag>{deadlineText}</DeadlineTag>}
		</div>
	);
}

interface ParticipantBarProp {
	/** 참여 가능 인원 */
	capacity: number;
	/** 참여자 수 */
	participantCount: number;
}
function ParticipantBar({ capacity, participantCount }: ParticipantBarProp) {
	return (
		<div className="flex w-full items-center [grid-area:participant-bar]">
			<IcPerson className="mr-1.25" />
			<ProgressBar
				max={capacity}
				current={participantCount}
				hasAnimation={false}
				className="h-[5px] w-[126px] md:w-[191px]"
			/>
			<div className="ml-3.25 text-sm text-gray-600 md:ml-2">
				<span className="font-bold text-purple-500">{participantCount}</span>
				<span>/</span>
				<span>{capacity}</span>
			</div>
		</div>
	);
}

interface ButtonProp extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	/** 버튼 클릭 이벤트 콜백 */
	onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
	/** 버튼 상태 변경 진행 여부 */
	isPending?: boolean;
}
function JoinButton({ onClick, isPending, ...props }: ButtonProp) {
	const { isRegClosed, isJoined, isCompleted } = useGroupCard();

	function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		e.stopPropagation();
		onClick(e);
	}

	return (
		!isCompleted && (
			<Button
				disabled={(!isJoined && isRegClosed) || isCompleted}
				colors={!isJoined ? "purple" : "purpleBorder"}
				className="relative z-2 mt-auto h-10 w-20 text-sm font-semibold [grid-area:join-button] md:h-12 md:w-[103px] md:text-base"
				onClick={handleClick}
				isPending={isPending}
				{...props}>
				{!isJoined ? "참여하기" : "참여 취소"}
			</Button>
		)
	);
}

function LikeButton({ onClick, isPending, ...props }: ButtonProp) {
	const { isLiked } = useGroupCard();

	function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		e.stopPropagation();
		onClick(e);
	}

	return (
		<UtilityButton
			pressed={isLiked}
			className={likeButtonStyle}
			onClick={handleClick}
			isPending={isPending}
			{...props}
		/>
	);
}
const likeButtonStyle = "z-2 absolute top-4 right-4 [grid-area:like-button] md:top-8 md:right-6";

// ----- context -----

const GroupCardContext = createContext<GroupCardStatus | null>(null);

function useGroupCard() {
	const ctx = useContext(GroupCardContext);
	if (!ctx) {
		throw new Error("useGroupCard는 GroupCardProvider 안에서만 사용할 수 있습니다");
	}
	return ctx;
}

GroupCard.Skeleton = GroupCardSkeleton;
GroupCard.Image = Image;
GroupCard.Content = Content;
GroupCard.Title = Title;
GroupCard.SubTitle = SubTitle;
GroupCard.BadgeGroup = BadgeGroup;
GroupCard.ParticipantBar = ParticipantBar;
GroupCard.JoinButton = JoinButton;
GroupCard.LikeButton = LikeButton;

export default GroupCard;
