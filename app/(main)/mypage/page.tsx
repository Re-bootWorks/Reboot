import MyProfile from "@/features/mypage/MyProfile";
import TabWrapper from "@/features/mypage/TabWrapper";
import { UserProfile } from "@/features/mypage/type";

// @TODO 추후 api 작업 예정
const mockUserProfile: UserProfile = {
	id: 1333,
	name: "소금빵",
	email: "test@example.com",
	image:
		"https://images.unsplash.com/photo-1700284923285-90d6fe468920?q=80&w=721&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

export default function My() {
	return (
		<>
			<MyProfile user={mockUserProfile} />
			<TabWrapper />
		</>
	);
}
