"use client";

import { IcEditOutline } from "@/components/ui/icons";
import Image from "next/image";
import { UserProfile } from "@/features/mypage/type";
import useToggle from "@/hooks/useToggle";
import { useUserStore } from "@/store/user.store";
import Skeleton from "react-loading-skeleton";
import { cn } from "@/utils/cn";
import ProfileModal from "../ProfileModal";

interface MyProfileProps {
	user: UserProfile;
	handleEditClick: () => void;
}

const EMPTY_PROFILE_IMAGE = "/assets/img/img_profile.svg";
const STYLE = {
	profileBox:
		"bg-gradient-purple-100-lr flex items-center gap-6 rounded-2xl border border-purple-400 p-4 md:rounded-3xl md:p-6 lg:flex-col lg:py-10",
	profileImage: "size-11 rounded-full border border-gray-200 object-cover md:size-28",
	profileName:
		"mb-2 flex items-center text-base font-semibold md:mb-4 md:text-lg lg:translate-x-3 lg:justify-center",
	profileEmail: "bg-gradient-purple-200-lr rounded-3xl px-3 py-1.5 text-sm text-gray-600",
};

export function MyProfileSkeleton() {
	return (
		<div className={cn(STYLE.profileBox, "gap-4")}>
			<Skeleton circle className="size-11! md:size-28!" />
			<div className="flex flex-col gap-2">
				<Skeleton width={150} height={26} />
				<Skeleton width={150} height={30} />
			</div>
		</div>
	);
}

function MyProfile({ user, handleEditClick }: MyProfileProps) {
	return (
		<div className={STYLE.profileBox}>
			<Image
				src={user.image ?? EMPTY_PROFILE_IMAGE}
				alt="프로필 이미지"
				className={STYLE.profileImage}
				width={114}
				height={114}
			/>
			<div>
				<div className={STYLE.profileName}>
					{user.name}
					<button
						type="button"
						className="cursor-pointer p-1.25"
						aria-label="프로필 수정"
						onClick={handleEditClick}>
						<IcEditOutline color="gray-500" size="xs" />
					</button>
				</div>
				<div className={STYLE.profileEmail}>{user.email}</div>
			</div>
		</div>
	);
}

export default function MyProfileContainer() {
	const { isOpen, open, close } = useToggle();
	const user = useUserStore((state) => state.user);
	const isLoading = useUserStore((state) => state.isPending);

	if (isLoading) return <MyProfileSkeleton />;
	if (!user) return null;

	return (
		<>
			<MyProfile user={user} handleEditClick={open} />
			<ProfileModal user={user} isOpen={isOpen} onClose={close} />
		</>
	);
}
