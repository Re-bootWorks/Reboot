"use client";

import { IcBellOutline, IcBellUnreadOutline } from "@/components/ui/icons";
import { Popover, PopoverBackdrop, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useGetNotificationsCount } from "../../queries";
import NotificationPanel from "../NotificationPanel";

const POPOVER_STYLE = {
	popoverButton: "cursor-pointer focus:outline-transparent focus-visible:outline-none",
	popoverBackdrop: "bg-black-50 fixed inset-0 md:bg-transparent",
	popoverPanel:
		"fixed inset-0 ml-auto flex h-full w-11/12 max-w-xl flex-col gap-4 rounded-l-3xl bg-white py-6 shadow-lg md:absolute md:top-[calc(100%+1rem)] md:-right-5 md:h-fit md:w-80 md:rounded-r-3xl",
};

export default function Notification() {
	// 읽지 않은 알람 갯수
	const { data: unReadCountData } = useGetNotificationsCount();
	const unreadCount = unReadCountData?.count ?? 0;

	return (
		<Popover className="relative leading-0">
			<PopoverButton className={POPOVER_STYLE.popoverButton}>
				{unreadCount > 0 ? <IcBellUnreadOutline /> : <IcBellOutline />}
			</PopoverButton>

			<PopoverBackdrop className={POPOVER_STYLE.popoverBackdrop} />
			<PopoverPanel className={POPOVER_STYLE.popoverPanel}>
				{({ close }) => <NotificationPanel close={close} unreadCount={unreadCount} />}
			</PopoverPanel>
		</Popover>
	);
}
