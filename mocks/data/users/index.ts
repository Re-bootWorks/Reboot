import type { User } from "@/features/auth/types";
import type { UserPublicProfile } from "@/types/user";
import { CURRENT_USER, USERS } from "./fixtures";

function getMe() {
	return CURRENT_USER;
}

function updateMe(updates: Partial<User>) {
	Object.assign(CURRENT_USER, updates, { updatedAt: new Date().toISOString() });
	return CURRENT_USER;
}

function getUserById(userId: number): UserPublicProfile | undefined {
	return USERS.find((u) => u.id === userId);
}

export default { getMe, updateMe, getUserById, currentUser: CURRENT_USER, users: USERS };
