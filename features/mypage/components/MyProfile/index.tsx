"use client";

import { IcEditOutline } from "@/components/ui/icons";
import Image from "next/image";
import { UserProfile } from "@/features/mypage/types";
import { mockUserProfile } from "@/features/mypage/mockData";
import { ProfileModal } from "../ProfileModal";
import useToggle from "@/hooks/useToggle";

interface MyProfileProps {
	user: UserProfile;
	onEditClick: () => void;
}

const EMPTY_PROFILE_IMAGE = "/assets/img/img_profile.svg";

function MyProfile({ user, onEditClick }: MyProfileProps) {
	return (
		<div className="lg:min-w-70.5">
			<h1 className="mb-2 text-base font-semibold md:mb-6 md:text-5xl lg:mb-11 lg:pt-3.5">
				마이페이지
			</h1>
			<div className="bg-gradient-purple-100-lr flex items-center gap-6 rounded-2xl border border-purple-400 p-4 md:rounded-3xl md:p-6 lg:flex-col lg:py-10">
				<Image
					src={user.image ?? EMPTY_PROFILE_IMAGE}
					alt="프로필 이미지"
					className="size-11 rounded-full border border-gray-200 object-cover md:size-28"
					width={114}
					height={114}
				/>
				<div>
					<div className="mb-2 flex items-center text-base font-semibold md:mb-4 md:text-lg lg:translate-x-3 lg:justify-center">
						{user.name}
						<button
							type="button"
							className="cursor-pointer p-1.25"
							aria-label="프로필 수정"
							onClick={onEditClick}>
							<IcEditOutline color="gray-500" size="xs" />
						</button>
					</div>
					<div className="bg-gradient-purple-200-lr rounded-3xl px-3 py-1.5 text-sm text-gray-600">
						{user.email}
					</div>
				</div>
			</div>
		</div>
	);
}

export default function MyProfileContainer() {
	// @TODO 추후 zustand로 변경 const user = useUserStore((state) => state.user);
	const user = mockUserProfile;
	const { isOpen, open, close } = useToggle();

	if (!user) return null;

	return (
		<>
			<MyProfile user={user} onEditClick={open} />
			<ProfileModal isOpen={isOpen} onClose={close} />
		</>
	);
}
