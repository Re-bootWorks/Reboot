import React from "react";
import Image from "next/image";
import Pagination from "@/components/ui/Pagination";
import { ReviewScore } from "@/types/common";
import { Rating, Heart } from "@smastrom/react-rating";
import { formatIsoDateWithDots } from "@/utils/date";
import ActionDropdown from "@/components/ui/Dropdowns/ActionDropdown";
import { User } from "@/features/meetupDetail/types";

export interface CommentProps {
	id: number;
	score: ReviewScore;
	comment: string;
	createdAt: string;
	user: User;
}

const EMPTY_IMAGE = "/assets/img/img_empty_purple.svg";
const DEFAULT_PROFILE = "/assets/img/img_profile.svg";
const MOCK_ID = 1;

function CommentItem({ score, comment, createdAt, user }: Omit<CommentProps, "id">) {
	const heartStyles = {
		itemShapes: Heart,
		activeFillColor: "#7566E5",
		inactiveFillColor: "#DDD",
	};

	const myReview = user.id === MOCK_ID;

	return (
		<div className="h-fit w-full border-b border-gray-200 pt-2 pb-6 last:border-none md:pt-4">
			<div className="flex h-fit w-full flex-col gap-3">
				<div className="h-fit w-full gap-1.5">
					<Rating
						value={score}
						readOnly
						itemStyles={heartStyles}
						className="max-w-25 md:max-w-30"
					/>
					<div className="flex h-fit w-full justify-between gap-2">
						<div className="flex h-fit w-fit items-center gap-1.5">
							<Image
								src={user.image ?? DEFAULT_PROFILE}
								alt={user.name}
								width={24}
								height={24}
								className="rounded-full object-cover"
							/>
							<div className="flex h-fit w-fit items-center gap-1 text-xs font-normal text-gray-500 md:gap-1.5 md:text-sm">
								<span>{user.name}</span>
								<time dateTime={createdAt}>{formatIsoDateWithDots(createdAt)}</time>
							</div>
						</div>
						{myReview && (
							<ActionDropdown
								items={[
									{ label: "수정하기", onClick: () => {} },
									{ label: "삭제하기", onClick: () => {} },
								]}
							/>
						)}
					</div>
				</div>
				<div className="flex h-fit w-full justify-between text-gray-700 md:gap-2">
					<p className="h-fit w-full text-sm font-normal md:text-lg">{comment}</p>
				</div>
			</div>
		</div>
	);
}

interface CommentCardsProps {
	comments: CommentProps[];
}

export default function CommentCards({ comments }: CommentCardsProps) {
	const hasComments = comments.length > 0;

	return (
		<div className="flex h-fit w-full flex-col gap-3 md:gap-4 lg:gap-5">
			<div className="flex h-fit w-full gap-2.5 pl-1.5 lg:pl-2.5">
				<h3 className="text-base font-semibold md:text-xl lg:text-2xl">리뷰 모아보기</h3>
			</div>

			<div className="flex h-fit w-full flex-col items-center gap-8 md:gap-10">
				<div className="flex h-fit w-full flex-col items-center gap-2.5 overflow-hidden rounded-3xl bg-white px-5 pt-4 pb-2 md:rounded-4xl md:px-12 md:py-6">
					{hasComments ? (
						<div className="flex h-fit w-full flex-col">
							{comments.map((comment) => (
								<CommentItem key={comment.id} {...comment} />
							))}
						</div>
					) : (
						<div className="flex h-fit w-full flex-col items-center gap-5 md:gap-6">
							<Image
								src={EMPTY_IMAGE}
								alt={"빈 이미지"}
								width={200}
								height={200}
								className="flex h-fit w-fit flex-col gap-2.5 object-cover"
							/>
							<span className="h-fit w-full text-center text-sm font-medium text-gray-500 md:text-base">
								아직 작성된 리뷰가 없어요.
							</span>
						</div>
					)}
				</div>

				{hasComments && <Pagination currentPage={1} totalPages={9} handlePageChange={() => {}} />}
			</div>
		</div>
	);
}
