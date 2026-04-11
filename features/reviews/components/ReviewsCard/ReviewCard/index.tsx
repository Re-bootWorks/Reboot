"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { Rating } from "@smastrom/react-rating";
import ActionDropdown from "@/components/ui/Dropdowns/ActionDropdown";
import { formatIsoDateWithDots } from "@/utils/date";
import { RATING_STYLE } from "@/constants/ratingStyle";
import { ReviewCardProps } from "@/features/reviews/types";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import { useExpandableText } from "@/hooks/useExpandableText";
import ExpandToggleButton from "@/components/ui/Buttons/ExpandToggleButton";
import UserProfileModal from "@/components/ui/Modals/UserProfileModal";
import { useUser } from "@/hooks/useUser";

const EMPTY_THUMBNAIL_SRC = "/assets/img/img_empty_purple.svg";
const CONTENT_HEIGHT_THRESHOLD = 200;

type Props = ReviewCardProps & {
	handleEdit?: () => void;
	handleDelete?: () => void;
};

export default function ReviewCard({
	meetingId,
	meetingImage,
	score,
	userImage,
	userName,
	userEmail,
	createdAt,
	comment,
	meetingName,
	meetingType,
	userId,
	handleEdit,
	handleDelete,
}: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const { user } = useUser();
	const loggedInUserId = user?.id;
	const isMyReview = userId === loggedInUserId;

	/** 실제 본문 높이만 측정할 래퍼 */
	const contentMeasureRef = useRef<HTMLDivElement>(null);

	/** 본문 높이가 기준을 넘어서 이미지에 mt-4를 넣을지 여부 */
	const [shouldAddImageMarginTop, setShouldAddImageMarginTop] = useState(false);

	const { contentRef, isExpanded, isOverflow, toggleExpanded } =
		useExpandableText<HTMLParagraphElement>({
			content: comment,
		});

	useLayoutEffect(() => {
		const element = contentMeasureRef.current;
		if (!element) return;

		const checkContentHeight = () => {
			/**
			 * rem 기반 spacing 때문에 소수점 높이가 나올 수 있어서
			 * ceil로 올림해서 비교
			 *
			 * 예:
			 * 199.2 -> 200
			 * 200.1 -> 201
			 */
			const contentHeight = Math.ceil(element.getBoundingClientRect().height);
			const nextShouldAddImageMarginTop = contentHeight > CONTENT_HEIGHT_THRESHOLD;

			setShouldAddImageMarginTop((prev) =>
				prev === nextShouldAddImageMarginTop ? prev : nextShouldAddImageMarginTop,
			);
		};

		checkContentHeight();

		const observer = new ResizeObserver(() => {
			checkContentHeight();
		});

		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	}, [comment, isExpanded]);

	const handleEditButtonClick = () => {
		handleEdit?.();
	};

	const handleDeleteButtonClick = () => {
		handleDelete?.();
	};

	return (
		<article className="flex h-full w-full flex-col gap-4 md:flex-row md:gap-8">
			{/* 모임 이미지 */}
			<Link
				href={`/meetup/${meetingId}`}
				className={cn(
					meetingImage ? "group relative overflow-hidden" : "flex items-center justify-center",
					shouldAddImageMarginTop && "md:mt-4",
					"h-36 rounded-xl bg-purple-50 pt-4 select-none md:size-46 md:shrink-0",
				)}>
				{meetingImage ? (
					<Image
						src={meetingImage}
						alt={`${meetingName} 모임 이미지`}
						fill
						className="rounded-xl object-cover transition-transform duration-450 ease-out group-hover:scale-107"
					/>
				) : (
					<Image
						src={EMPTY_THUMBNAIL_SRC}
						alt="빈 모임 이미지"
						width={120}
						height={72}
						className="object-contain"
					/>
				)}
			</Link>

			{/* 본문 */}
			<div className="w-full border-b border-b-gray-200">
				<div ref={contentMeasureRef} className="flex flex-col gap-3 pb-6 md:gap-0">
					<div className="flex flex-col gap-3 md:gap-6">
						<div className="relative flex flex-col gap-2 md:gap-3.5 md:pt-4">
							{/* 별점 + 수정·삭제 버튼 */}
							<div className="flex h-6 items-center justify-between">
								<Rating
									value={score}
									readOnly
									itemStyles={RATING_STYLE}
									className="max-w-25 md:max-w-30"
								/>

								{isMyReview ? (
									<ActionDropdown
										actionsSize="lg"
										className="flex items-end"
										items={[
											{
												label: "수정하기",
												onClick: handleEditButtonClick,
											},
											{
												label: "삭제하기",
												onClick: handleDeleteButtonClick,
											},
										]}
										aria-label="리뷰 옵션 열기"
										actionsIconClassName="md:size-10"
									/>
								) : null}
							</div>

							{/* 작성자 / 날짜 */}
							<div className="flex items-center gap-1 md:gap-1.5">
								<button
									type="button"
									onClick={() => setIsOpen(true)}
									aria-label={`${userName} 프로필 보기`}
									className="flex cursor-pointer items-center gap-1.5">
									<Avatar
										src={userImage}
										alt={userImage ? `${userName} 프로필 이미지` : "빈 프로필 이미지"}
										width={24}
										height={24}
										className={cn(
											userImage?.trim()
												? "size-6 border-0 object-cover"
												: "size-6 border object-contain",
											"select-none",
										)}
									/>
									<span className="text-xs text-gray-500 md:text-sm">{userName}</span>
								</button>

								<time dateTime={createdAt} className="text-xs text-gray-500 md:text-sm">
									{formatIsoDateWithDots(createdAt)}
								</time>
							</div>
						</div>

						{/* 리뷰 내용 */}
						<div className="flex flex-col items-start gap-2">
							<p
								ref={contentRef}
								className={cn(
									"text-sm whitespace-pre-line text-gray-700 md:text-lg",
									!isExpanded && "line-clamp-2",
								)}>
								{comment}
							</p>

							{(isOverflow || isExpanded) && (
								<ExpandToggleButton isExpanded={isExpanded} onClick={toggleExpanded} />
							)}
						</div>
					</div>

					{/* 모임명 / 카테고리 */}
					<div className="space-x-0.5 text-xs font-medium text-gray-500 md:text-sm">
						<Link href={`/meetup/${meetingId}`} className="select-none">
							{meetingName}
						</Link>
						<span aria-hidden="true" className="select-none">
							·
						</span>
						<span className="select-none">{meetingType}</span>
					</div>
				</div>
			</div>

			<UserProfileModal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				authorName={userName}
				authorImage={userImage || undefined}
				email={userEmail || undefined}
			/>
		</article>
	);
}
