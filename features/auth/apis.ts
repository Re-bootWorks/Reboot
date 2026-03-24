import { clientFetch } from "@/libs/clientFetch";

export async function postLogin(data: { email: string; password: string }) {
	const response = await clientFetch("/auth/login", {
		method: "POST",
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = new Error("로그인 실패") as Error & { status: number };
		error.status = response.status;
		throw error;
	}

	return response.json();
}

export async function postSignUp(data: { email: string; password: string; name: string }) {
	const response = await clientFetch("/auth/signup", {
		method: "POST",
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = new Error("회원가입 실패") as Error & { status: number };
		error.status = response.status;
		throw error;
	}

	return response.json();
}

export async function postLogout() {
	return clientFetch("/auth/logout", {
		method: "POST",
	});
}
