import MyProfileContainer from "@/features/mypage/MyProfile";
import MyTab from "@/features/mypage/MyTab";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "마이페이지",
	robots: {
		index: false,
		follow: false,
	},
};

export default async function My() {
	return (
		<>
			<div className="lg:min-w-70.5">
				<h1 className="mb-2 text-lg font-semibold md:mb-6 md:text-5xl lg:mb-11 lg:pt-3.5">
					마이페이지
				</h1>
				<MyProfileContainer />
			</div>
			<MyTab />
		</>
	);
}
