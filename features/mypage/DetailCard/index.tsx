import { Badge } from "@/components/ui/Badges";
import Button from "@/components/ui/Buttons/Button";
import UtilityButton from "@/components/ui/Buttons/UtilityButton";
import { IcPerson } from "@/components/ui/icons";
import { StatusLabel } from "@/components/ui/StatusLabel";
import Image from "next/image";
import { uiFormatDate, uiFormatTime } from "@/features/Post/utills";
import { cn } from "@/utils/cn";
import SendButton from "@/components/ui/Buttons/SendButton";
import { DetailCardProps } from "./type";

const STYLE = {
	itemBgBox: "relative overflow-hidden rounded-3xl bg-white md:flex md:gap-6 md:rounded-4xl md:p-6",
	itemImage: "h-39 w-full object-cover md:size-47 md:rounded-3xl",
	wishBtn: "absolute top-4 right-4 md:top-6 md:right-6",
	itemWrapper: "flex grow flex-col justify-between gap-3 p-4 md:px-0 md:py-2.5",
	itemContent:
		"flex flex-col gap-5.5  md:justify-between min-[870px]:flex-row min-[870px]:items-center",
	personInfo: "flex items-center gap-2 text-sm",
	itemInfoList: "mt-1.5 flex gap-2.5 md:mt-2.5",
	itemInfoLabel: "pr-1.5 text-gray-500",
	itemInfo:
		"text-xs text-gray-600 after:pl-2.5 after:text-gray-300 after:content-['|'] last:after:hidden sm:text-sm",
	btnWrapper: "flex justify-end gap-4 ",
	actionBtn: `h-12 w-fit min-w-[calc(50%-0.5rem)] rounded-xl min-[870px]:min-w-auto lg:min-w-39`,
};

export default function DetailCard({ item, badges, actions, wishAction }: DetailCardProps) {
	const isWishable = !item.isCompleted && item.participantCount < item.capacity;

	return (
		<li className={STYLE.itemBgBox}>
			<Image
				src={item.image ?? "/assets/img/img_empty_purple.svg"}
				alt="모임 대표 이미지"
				width={343}
				height={343}
				className={cn(STYLE.itemImage, !!item.image ? "" : "bg-purple-50 object-scale-down")}
			/>
			<div className={STYLE.wishBtn}>
				{isWishable ? (
					<UtilityButton
						pressed={wishAction?.isWished}
						isPending={wishAction?.isPending}
						onClick={wishAction?.handleWishClick}
					/>
				) : (
					<SendButton />
				)}
			</div>

			<div className={STYLE.itemWrapper}>
				<div>
					{badges && (
						<div className="mb-3 flex gap-2">
							{badges?.map((badge) => (
								<Badge key={badge.label} variant={badge.variant}>
									{badge.showStatusLabel ? <StatusLabel>{badge.label}</StatusLabel> : badge.label}
								</Badge>
							))}
						</div>
					)}
					<h2 className="text-xl font-semibold">{item.name}</h2>
				</div>
				<div className={STYLE.itemContent}>
					<div>
						<span className={STYLE.personInfo}>
							<IcPerson />
							{item.participantCount}/{item.capacity}
						</span>
						<ul className={STYLE.itemInfoList}>
							<li className={STYLE.itemInfo}>
								<span className={STYLE.itemInfoLabel}>위치</span>
								{item.region}
							</li>
							<li className={STYLE.itemInfo}>
								<span className={STYLE.itemInfoLabel}>날짜</span>
								{uiFormatDate(item.dateTime)}
							</li>
							<li className={STYLE.itemInfo}>
								<span className={STYLE.itemInfoLabel}>시간</span>
								{uiFormatTime(item.dateTime)}
							</li>
						</ul>
					</div>
					<div className={STYLE.btnWrapper}>
						{actions &&
							actions?.map((action) => (
								<Button
									key={action.label}
									onClick={action.handleCardButtonClick}
									colors={action.variant}
									sizes="smallMedium"
									className={cn(STYLE.actionBtn, action.isDestructive ? "text-error" : "")}>
									{action.label}
								</Button>
							))}
					</div>
				</div>
			</div>
		</li>
	);
}
