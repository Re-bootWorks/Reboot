"use client";

import { cn } from "@/utils/cn";
import Image from "next/image";
import { Rating } from "@smastrom/react-rating";
import ActionDropdown from "@/components/ui/Dropdowns/ActionDropdown";
import { formatIsoDateWithDots } from "@/utils/date";
import { RATING_STYLE } from "@/constants/ratingStyle";
import { ReviewCardProps } from "@/features/reviews/types";
import { MOCK_LOGIN_USER_ID } from "@/features/reviews/mockData";
import Link from "next/link";

const EMPTY_THUMBNAIL_SRC = "/assets/img/img_empty_purple.svg";
const EMPTY_PROFILE_SRC = "/assets/img/img_profile.svg";

export default function ReviewCard({
	meetingId,
	meetingImage,
	score,
	userImage,
	userName,
	createdAt,
	comment,
	meetingName,
	meetingType,
	userId,
}: ReviewCardProps) {
	const isMyReview = userId === MOCK_LOGIN_USER_ID;

	const handleEditButtonClick = () => {
		// TODO: 리뷰 수정 기능 추후 구현 예정
	};

	const handleDeleteButtonClick = () => {
		// TODO: 리뷰 삭제 기능 추후 구현 예정
	};

	const handleProfileClick = () => {
		// TODO: 프로필 보기 구현 예정
	};

	return (
		<article className="flex w-full flex-col gap-3 md:flex-row md:gap-8">
			{/* 모임 이미지 */}
			<Link
				href={`/meetup/${meetingId}`}
				className={cn(
					meetingImage ? "group relative overflow-hidden" : "flex items-center justify-center",
					"h-36 rounded-xl bg-purple-50 select-none md:size-46 md:shrink-0",
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
			<div className="flex w-full flex-col gap-3 border-b border-b-gray-200 pb-6 md:gap-0">
				<div className="flex flex-col gap-3 md:gap-6">
					<div className="relative flex flex-col gap-2 md:gap-3.5 md:pt-4">
						{/* 별점 + 액션 버튼 */}
						<div className="flex items-center justify-between">
							<Rating
								value={score}
								readOnly
								itemStyles={RATING_STYLE}
								className="max-w-25 md:max-w-30"
							/>

							{isMyReview ? (
								<ActionDropdown
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
								onClick={handleProfileClick}
								className="flex cursor-pointer items-center gap-1.5 select-none">
								<div className="relative size-6">
									{userImage ? (
										<Image
											src={userImage}
											alt={`${userName} 프로필 이미지`}
											fill
											className="rounded-full object-cover"
										/>
									) : (
										<Image
											src={EMPTY_PROFILE_SRC}
											alt="빈 프로필 이미지"
											width={24}
											height={24}
											className="rounded-full border border-gray-200 object-contain"
										/>
									)}
								</div>

								<span className="text-xs text-gray-500 md:text-sm">{userName}</span>
							</button>

							<time dateTime={createdAt} className="text-xs text-gray-500 md:text-sm">
								{formatIsoDateWithDots(createdAt)}
							</time>
						</div>
					</div>

					{/* 리뷰 내용 */}
					<Link href={`/meetup/${meetingId}`}>
						<p className="text-sm whitespace-pre-line text-gray-700 md:mb-2 md:text-lg">
							{comment}
						</p>
					</Link>
				</div>
				{/* 모임명 / 카테고리 */}
				<div className="space-x-0.5 text-xs font-medium text-gray-500 md:text-sm">
					<Link href={`/meetup/${meetingId}`} className="select-none">
						{meetingName}
					</Link>
					<span aria-hidden="true" className="select-none">
						·
					</span>
					<span>{meetingType}</span>
				</div>
			</div>
		</article>
	);
}
