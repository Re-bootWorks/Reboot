import { cn } from "@/utils/cn";
import Image from "next/image";
import { ReviewCardProps } from "@/features/mypage/types";
import { Rating } from "@smastrom/react-rating";
import { RATING_STYLE } from "@/constants/ratingStyle";
import ActionDropdown from "@/components/ui/Dropdowns/ActionDropdown";
import { formatIsoDateWithDots } from "@/utils/date";
import Link from "next/link";
import { useExpandableText } from "@/hooks/useExpandableText";
import ExpandToggleButton from "@/components/ui/Buttons/ExpandToggleButton";

const STYLE = {
	itemBox: "flex flex-col gap-3 md:flex-row md:gap-8 group",
	itemImageLink:
		"relative h-39 shrink-0 overflow-hidden rounded-xl md:size-46 md:rounded-3xl md:pt-6",
	itemImage: "w-full object-cover transition-transform duration-450 ease-out",
	itemWrapper:
		"flex grow flex-col gap-3 border-b border-gray-200 pb-6 md:py-6 group-last-of-type:border-none",
	ratingWrapper: "flex w-full items-center justify-between",
	profileWrapper: "mt-1.5 flex items-center gap-1.5",
	profileImage: "size-6 rounded-full border border-gray-200 object-cover",
	caption: "text-xs text-gray-500 md:text-sm",
	itemInfoList: "mt-1.5 flex flex-wrap gap-x-2.5 gap-y-2 md:mt-2.5",
	itemInfoLabel: "pr-1.5 text-gray-500",
	itemInfo:
		"text-xs text-gray-600 after:pl-2.5 after:text-gray-300 after:content-['|'] last:after:hidden sm:text-sm",
};

const EMPTY_THUMBNAIL_IMAGE = "/assets/img/img_empty_purple.svg";
const EMPTY_PROFILE_IMAGE = "/assets/img/img_profile.svg";

export default function ReviewCard({
	user,
	item,
	handleEdit,
	handleDelete,
	onDropdownOpenChange,
}: ReviewCardProps) {
	const { contentRef, isExpanded, isOverflow, toggleExpanded } =
		useExpandableText<HTMLParagraphElement>({
			content: item.comment,
		});
	return (
		<li className={STYLE.itemBox}>
			<Link href={`/meetup/${item.meetingId}`} className={STYLE.itemImageLink}>
				<Image
					src={item.meetingImage ?? EMPTY_THUMBNAIL_IMAGE}
					alt={`${item.meetingName}모임 대표 이미지`}
					fill
					className={cn(
						STYLE.itemImage,
						!!item.meetingImage ? "hover:scale-107" : "bg-purple-50 object-scale-down",
					)}
				/>
			</Link>
			<ul className={STYLE.itemWrapper}>
				<li>
					<div className={STYLE.ratingWrapper}>
						<Rating value={item.score} itemStyles={RATING_STYLE} className="max-w-30" readOnly />
						<ActionDropdown
							className="leading-0"
							aria-label="리뷰 옵션 열기"
							actionsIconClassName="md:size-10"
							onOpenChange={onDropdownOpenChange}
							items={[
								{ label: "수정하기", onClick: handleEdit, className: "h-9" },
								{ label: "삭제하기", onClick: handleDelete, className: "h-9" },
							]}
						/>
					</div>
					<div className={STYLE.profileWrapper}>
						<Image
							src={user.image ?? EMPTY_PROFILE_IMAGE}
							alt="프로필 이미지"
							className={STYLE.profileImage}
							width={24}
							height={24}
						/>
						<div className={STYLE.caption}>{user.name}</div>
						<div className={STYLE.caption}>{formatIsoDateWithDots(item.meetingDateTime)}</div>
					</div>
				</li>
				<li>
					<p
						ref={contentRef}
						className={cn(
							"text-sm break-all text-gray-700 md:text-lg",
							!isExpanded ? "line-clamp-2" : "",
						)}>
						{item.comment}
					</p>
					{(isOverflow || isExpanded) && (
						<ExpandToggleButton
							isExpanded={isExpanded}
							onClick={toggleExpanded}
							className="mt-1 md:mb-0 md:text-base"
						/>
					)}
				</li>
				<li>
					<ul className={STYLE.itemInfoList}>
						<li className={STYLE.itemInfo}>{item.meetingName}</li>
						<li className={STYLE.itemInfo}>
							<span className={STYLE.itemInfoLabel}>카테고리</span>
							{item.meetingType}
						</li>
						<li className={STYLE.itemInfo}>
							<span className={STYLE.itemInfoLabel}>작성 일시</span>
							{formatIsoDateWithDots(item.createdAt)}
						</li>
					</ul>
				</li>
			</ul>
		</li>
	);
}
