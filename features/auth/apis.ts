import { clientFetch } from "@/libs/clientFetch";

export async function postLogin(data: { email: string; password: string }) {
	const response = await clientFetch("/auth/login", {
		method: "POST",
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		let data;
		try {
			data = await response.json();
		} catch {
			data = null;
		}
		const error = new Error(data?.message ?? "오류가 발생했습니다.") as Error & {
			status: number;
		};
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
		let data;
		try {
			data = await response.json();
		} catch {
			data = null;
		}
		const error = new Error(data?.message ?? "오류가 발생했습니다.") as Error & {
			status: number;
		};
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

export async function postSocialLogin(data: { accessToken: string; refreshToken: string }) {
	return clientFetch("/auth/socialLogin", {
		method: "POST",
		body: JSON.stringify(data),
	});
}
