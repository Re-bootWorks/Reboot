import DetailCardSkeleton from "@/features/mypage/components/DetailCard/DetailCardSkeleton";
import { MyProfileSkeleton } from "@/features/mypage/MyProfile";
import TabSkeleton from "@/features/mypage/MyTab/TabWrapper/TabSkeleton";

export default async function MypageLoading() {
	return (
		<>
			<div className="lg:min-w-70.5">
				<h1 className="mb-2 text-lg font-semibold md:mb-6 md:text-5xl lg:mb-11 lg:pt-3.5">
					마이페이지
				</h1>
				<MyProfileSkeleton />
			</div>
			<div>
				<TabSkeleton />
				<DetailCardSkeleton />
			</div>
		</>
	);
}
