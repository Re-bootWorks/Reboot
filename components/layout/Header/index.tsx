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
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import useToggle from "@/hooks/useToggle";
import { useUserStore } from "@/store/user.store";
import { useModalStore } from "@/store/modal.store";
import { useLogout } from "@/features/auth/mutations";
import { LoginModal } from "@/features/auth/components/LoginModal";
import { SignUpModal } from "@/features/auth/components/SignUpModal";
import ActionDropdown from "@/components/ui/Dropdowns/ActionDropdown";
import { useRouter } from "next/navigation";
import { useGetFavoritesCount } from "@/features/header/queries";

interface GNBProps {
	favoritesCount?: number;
	showChevron?: boolean;
	handleItemClick?: () => void;
	className?: string;
}
interface SidebarProps {
	isOpen: boolean;
	isLogin: boolean;
	handleSidebarClose: () => void;
	favoritesCount?: number;
}

const STYLE = {
	header: "sticky top-0 left-0 z-10 flex items-center justify-between bg-gray-50 py-2 md:py-4 ",
	logo: "font-taenada w-fit p-2 text-base leading-none text-purple-500 md:text-2xl",
	gnb: "flex items-center gap-4",
	sidebar:
		"fixed inset-0 flex h-full max-w-xl w-11/12 flex-col justify-between rounded-r-3xl bg-white py-6",
	sidebarItem: "px-4 py-2 flex items-center justify-between",
	link: "flex items-center gap-1 p-4 text-base text-gray-600 cursor-pointer",
	etc: "flex items-center gap-4 md:gap-6",
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
							{key === "favorites" && favoritesCount !== undefined && favoritesCount > 0 && (
								<GNBBadge>{favoritesCount}</GNBBadge>
							)}
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
					<LogoutButton showSidebar handleSidebarClose={handleSidebarClose} />
				) : (
					<LoginButton showSidebar handleSidebarClose={handleSidebarClose} />
				)}
			</DialogPanel>
		</Dialog>
	);
}

function LoginButton({
	showSidebar,
	handleSidebarClose,
}: {
	showSidebar?: boolean;
	handleSidebarClose?: () => void;
}) {
	const { openLogin } = useModalStore();
	return showSidebar ? (
		<button
			type="button"
			className={cn(STYLE.sidebarItem, "justify-end")}
			onClick={() => {
				openLogin();
				handleSidebarClose?.();
			}}>
			<span className={STYLE.link}>로그인</span>
		</button>
	) : (
		<button type="button" className={cn(STYLE.link, "hidden md:block")} onClick={openLogin}>
			로그인
		</button>
	);
}

function LogoutButton({
	showSidebar,
	handleSidebarClose,
}: {
	showSidebar?: boolean;
	handleSidebarClose?: () => void;
}) {
	const { mutate: logout, isPending } = useLogout();

	return showSidebar ? (
		<button
			type="button"
			className={cn(STYLE.sidebarItem, "justify-end")}
			onClick={() => {
				logout();
				handleSidebarClose?.();
			}}
			disabled={isPending}
			aria-busy={isPending}>
			<span className={STYLE.link}>로그아웃</span>
		</button>
	) : (
		<button
			type="button"
			onClick={() => logout()}
			className={cn(STYLE.link, "hidden md:block")}
			disabled={isPending}
			aria-busy={isPending}>
			로그아웃
		</button>
	);
}

export default function Header() {
	const { mutate: logout, isPending } = useLogout();
	const { isOpen, open, close } = useToggle();
	const user = useUserStore((state) => state.user);
	const router = useRouter();

	const isLoggedIn = !!user;
	const isAlarm = false;
	const { data: favoritesCount } = useGetFavoritesCount();
	return (
		<>
			<Container as="header" className={STYLE.header}>
				<div className={STYLE.gnb}>
					<Link href="/">
						<div className={STYLE.logo}>Re:boot</div>
					</Link>
					<nav className="hidden md:flex" aria-label="상단 내비게이션">
						<GNB favoritesCount={favoritesCount?.count} />
					</nav>
					<Sidebar
						isOpen={isOpen}
						isLogin={isLoggedIn}
						handleSidebarClose={close}
						favoritesCount={favoritesCount?.count}
					/>
				</div>
				<div className={STYLE.etc}>
					{isLoggedIn ? (
						<>
							<button
								type="button"
								disabled={!isAlarm}
								className={cn(isAlarm ? "cursor-pointer" : "cursor-default")}>
								{isAlarm ? <IcBellUnreadOutline /> : <IcBellOutline />}
							</button>
							<div className="hidden md:block">
								<ActionDropdown
									triggerType="profile"
									menuClassName="z-10"
									profileImage={user.image}
									items={[
										{
											label: "마이페이지",
											onClick: () => router.push("/mypage"),
										},
										{
											label: "로그아웃",
											onClick: () => logout(),
											disabled: isPending,
											danger: true,
										},
									]}
								/>
							</div>
						</>
					) : (
						<LoginButton />
					)}
					<button type="button" className="cursor-pointer md:hidden" onClick={open}>
						<IcMenu />
					</button>
				</div>
			</Container>
			<LoginModal />
			<SignUpModal />
		</>
	);
}
