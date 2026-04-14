import type { User } from "@/features/auth/types";
import type { UserPublicProfile } from "@/types/user";
import { TEAM_ID } from "../../constants";

export const CURRENT_USER: User = {
	id: 1,
	teamId: TEAM_ID,
	email: "test@example.com",
	name: "홍길동",
	image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop",
	createdAt: "2024-01-01T00:00:00.000Z",
	updatedAt: "2024-01-01T00:00:00.000Z",
};

export const USERS: UserPublicProfile[] = [
	{
		id: 1,
		teamId: TEAM_ID,
		email: "test@example.com",
		name: "홍길동",
		companyName: "코드잇",
		image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop",
	},
	{
		id: 2,
		teamId: TEAM_ID,
		email: "chulsoo@example.com",
		name: "김철수",
		companyName: "네이버",
		image: null,
	},
	{
		id: 3,
		teamId: TEAM_ID,
		email: "young@example.com",
		name: "이영희",
		companyName: "카카오",
		image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
	},
];
