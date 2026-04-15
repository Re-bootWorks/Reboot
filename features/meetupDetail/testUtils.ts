import { MeetupEditData } from "@/features/meetupDetail/edit/types";
import { useUser } from "@/hooks/useUser";

// ─────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────
export const mockEditInitialData: MeetupEditData = {
	name: "달램핏 모임",
	type: "달램핏",
	region: "건대입구",
	address: "서울시 광진구 자양동 123-45, 3층",
	_addressName: "서울시 광진구 자양동 123-45",
	_addressDetail: "3층",
	latitude: 37.5407,
	longitude: 127.0693,
	dateTime: "2026-04-30T14:00:00.000Z",
	registrationEnd: "2026-04-27T14:00:00.000Z",
	capacity: 10,
	image: "/img.svg",
	description: "함께 운동해요!",
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
export const mockUser = (id: number | null, isPending = false) => {
	(useUser as jest.Mock).mockReturnValue({
		user: id
			? {
					id,
					teamId: "t1",
					email: "a@a.com",
					name: "유저",
					image: null,
					createdAt: "",
					updatedAt: "",
				}
			: null,
		isPending,
		isLoggedIn: !!id,
		isError: false,
	});
};
