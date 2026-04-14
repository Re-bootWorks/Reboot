import users from "../users";
import { MOCK_TOKENS } from "./fixtures";
import { TEAM_ID } from "../../constants";
import type { User } from "@/features/auth/types";

type AuthErrorBody = { code: string; message: string };
type AuthFailure = { ok: false; error: AuthErrorBody };

type LoginSuccessData = {
	user: User;
	accessToken: string;
	refreshToken: string;
};
type LoginResult = { ok: true; data: LoginSuccessData } | AuthFailure;

function login(email: string, password: string): LoginResult {
	if (!email || !password) {
		return {
			ok: false,
			error: { code: "INVALID_INPUT", message: "이메일 또는 비밀번호가 올바르지 않습니다." },
		};
	}
	return { ok: true, data: { user: users.getMe(), ...MOCK_TOKENS } };
}

type SignupSuccessData = {
	id: number;
	teamId: string;
	email: string;
	name: string;
	companyName: string | null;
	image: null;
	createdAt: string;
	updatedAt: string;
};
type SignupResult = { ok: true; data: SignupSuccessData } | AuthFailure;

function signup(body: {
	email: string;
	password: string;
	name: string;
	companyName?: string;
}): SignupResult {
	if (!body.email || !body.password || !body.name) {
		return { ok: false, error: { code: "INVALID_INPUT", message: "필수 항목이 누락되었습니다." } };
	}
	return {
		ok: true,
		data: {
			id: 99,
			teamId: TEAM_ID,
			email: body.email,
			name: body.name,
			companyName: body.companyName ?? null,
			image: null,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
	};
}

export default { login, signup };
