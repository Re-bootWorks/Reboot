"use client";

import Link from "next/link";
import Container from "../Container";
import { ACCOUNT_MENU_ITEM, GNB_MENU_ITEMS } from "@/constants/navigation";
import { ReactNode } from "react";
import { cn } from "@/utils/cn";
import {
	IcBellOutline,
	IcBellUnreadOutline,
	IcChevronRight,
	IcDelete,
	IcMenu,
} from "@/components/ui/icons";
import Image from "next/image";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import useToggle from "@/hooks/useToggle";

interface GNBProps {
	favoritesCount: number;
	showChevron?: boolean;
	handleItemClick?: () => void;
	className?: string;
}
interface SidebarProps {
	isOpen: boolean;
	isLogin: boolean;
	handleSidebarClose: () => void;
	favoritesCount: number;
}

const STYLE = {
	header: "sticky top-0 left-0 z-10 flex items-center justify-between bg-gray-50 py-2 md:py-4 ",
	logo: "font-taenada w-fit p-2 text-base leading-none text-purple-500 md:text-2xl",
	gnb: "flex items-center gap-4",
	sidebar:
		"fixed inset-0 flex h-full max-w-xl w-11/12 flex-col justify-between rounded-r-3xl bg-white py-6",
	sidebarItem: "px-4 py-2 flex items-center justify-between",
	link: "flex items-center gap-1 p-4 text-base text-gray-600",
	etc: "flex items-center gap-4 md:gap-6",
	image: "rounded-full border border-gray-200",
};

function GNBBadge({ children }: { children: ReactNode }) {
	return (
		<span className="rounded-full bg-purple-500 px-2 text-xs font-semibold text-white">
			{children}
		</span>
	);
}

function GNB({ favoritesCount, handleItemClick, showChevron = false, className }: GNBProps) {
	return (
		<>
			{GNB_MENU_ITEMS.map((item) => {
				const { href, label, key } = item;
				return (
					<Link key={key} href={href} className={className} onClick={handleItemClick}>
						<span className={STYLE.link}>
							{label}
							{key === "favorites" && <GNBBadge>{favoritesCount}</GNBBadge>}
						</span>
						{showChevron && <IcChevronRight />}
					</Link>
				);
			})}
		</>
	);
}

function Sidebar({ isOpen, isLogin, handleSidebarClose, favoritesCount }: SidebarProps) {
	return (
		<Dialog open={isOpen} onClose={handleSidebarClose} className={"relative z-30 md:hidden"}>
			<DialogBackdrop className="bg-black-50 fixed inset-0" />
			<DialogPanel className={STYLE.sidebar}>
				<div>
					<button
						type="button"
						onClick={handleSidebarClose}
						className="mb-6 ml-6 cursor-pointer"
						aria-label="모바일 내비게이션 닫기">
						<IcDelete />
					</button>
					<nav aria-label="모바일 내비게이션">
						<GNB
							showChevron
							favoritesCount={favoritesCount}
							handleItemClick={handleSidebarClose}
							className={STYLE.sidebarItem}
						/>
						{isLogin && (
							<Link
								href={ACCOUNT_MENU_ITEM.href}
								className={STYLE.sidebarItem}
								onClick={handleSidebarClose}>
								<span className={STYLE.link}>{ACCOUNT_MENU_ITEM.label}</span>
								<IcChevronRight />
							</Link>
						)}
					</nav>
				</div>
				{isLogin ? (
					<button type="button" className={cn(STYLE.sidebarItem, "justify-end")}>
						<span className={STYLE.link}>로그아웃</span>
					</button>
				) : (
					<button type="button" className={cn(STYLE.sidebarItem, "justify-end")}>
						<span className={STYLE.link}>로그인</span>
					</button>
				)}
			</DialogPanel>
		</Dialog>
	);
}

export default function Header() {
	const { isOpen, open, close } = useToggle();
	// @TODO 추후 기능 구현 예정
	const isLogin = true;
	const isAlarm = false;
	const favoritesCount = 1;
	const profile = null;

	return (
		<Container as="header" className={STYLE.header}>
			<div className={STYLE.gnb}>
				<Link href="/">
					<div className={STYLE.logo}>Re:boot</div>
				</Link>
				<nav className="hidden md:flex" aria-label="상단 내비게이션">
					<GNB favoritesCount={favoritesCount} />
				</nav>
				<Sidebar
					isOpen={isOpen}
					isLogin={isLogin}
					handleSidebarClose={close}
					favoritesCount={favoritesCount}
				/>
			</div>
			<div className={STYLE.etc}>
				{isLogin ? (
					<>
						<button
							type="button"
							disabled={!isAlarm}
							className={cn(isAlarm ? "cursor-pointer" : "cursor-default")}>
							{isAlarm ? <IcBellUnreadOutline /> : <IcBellOutline />}
						</button>
						<div className="hidden md:block">
							<button type="button" className={STYLE.image}>
								<Image
									src={profile ? profile : "/assets/img/img_profile.svg"}
									alt="프로필 이미지"
									width={44}
									height={44}
								/>
							</button>
						</div>
					</>
				) : (
					<>
						<button type="button" className={cn(STYLE.link, "hidden md:block")}>
							로그인
						</button>
					</>
				)}
				<button type="button" className="cursor-pointer md:hidden" onClick={open}>
					<IcMenu />
				</button>
			</div>
		</Container>
	);
}
