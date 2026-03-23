import React from "react";
import Image from "next/image";
import Pagination from "@/components/ui/Pagination";
import { ReviewScore } from "@/features/reviews/components/ReviewCard";
import { Rating, Heart } from "@smastrom/react-rating";
import { formatIsoDateWithDots } from "@/utils/date";
import ActionDropdown from "@/components/ui/Dropdowns/ActionDropdown";

//TODO: 현재 사용하지 않는 타입은 추후 사용 예정
export type User = {
	id: number;
	name: string;
	image: string | null;
};

export type Meeting = {
	id: number;
	name: string;
	type: string;
	region: string;
	image: string;
	dateTime: string;
};

interface CommentCardsProps {
	id: number;
	teamId: string;
	meetingId: number;
	userId: number;
	score: ReviewScore;
	comment: string;
	createdAt: string;
	updatedAt: string;
	user: User;
	meeting: Meeting;
}

const DEFAULT_PROFILE = "/assets/img/img_profile.svg";
const MOCK_ID = 1;

export default function CommentCards({ score, comment, createdAt, user }: CommentCardsProps) {
	const heartStyles = {
		itemShapes: Heart,
		activeFillColor: "#7566E5",
		inactiveFillColor: "#DDD",
	};

	const myReview = user.id === MOCK_ID;

	return (
		<div className="flex h-188 w-85.75 flex-col gap-3 md:h-216.5 md:w-174 md:gap-4 lg:h-211 lg:w-7xl lg:gap-5">
			{/* 제목 */}
			<div className="flex h-fit w-full gap-2.5 pl-1.5 lg:pl-2.5">
				<h3 className="h-fit w-fit text-base font-semibold md:text-xl lg:text-2xl">
					리뷰 모아보기
				</h3>
			</div>

			{/* 리뷰 목록 */}
			<div className="flex h-fit w-full flex-col items-center gap-8 md:gap-10">
				<div className="flex h-fit w-full flex-col gap-2.5 overflow-hidden rounded-3xl bg-white px-5 pt-4 pb-2 md:rounded-4xl md:px-12 md:py-6">
					<div className="flex h-fit w-full flex-col gap-6">
						{/* 밑줄을 나타내는 컨테이너 */}
						<div className="h-fit w-full border-b border-gray-200 pt-2 pb-6 md:pt-4">
							{/* 별점 & 작성자 & 내용 */}
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
										<div>
											{myReview ? (
												<ActionDropdown
													items={[
														{
															label: "수정하기",
															onClick: () => {},
														},
														{
															label: "삭제하기",
															onClick: () => {},
														},
													]}
												/>
											) : null}
										</div>
									</div>
								</div>

								<div className="flex h-fit w-full justify-between text-gray-700 md:gap-2">
									<div className="flex h-fit w-full items-center gap-3 pr-4 md:gap-2.5 md:px-0.5">
										<p className="h-fit w-full items-start text-sm font-normal md:text-lg">
											{comment}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 페이지네이션 */}
				<div className="flex h-fit w-fit gap-2.5">
					<Pagination currentPage={1} totalPages={9} handlePageChange={() => {}} />
				</div>
			</div>
		</div>
	);
}
