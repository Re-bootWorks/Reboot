import { clientFetch } from "@/libs/clientFetch";

export async function postLogin(data: { email: string; password: string }) {
	return clientFetch("/auth/login", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function postSignUp(data: { email: string; password: string; name: string }) {
	return clientFetch("/auth/signup", {
		method: "POST",
		body: JSON.stringify(data),
	});
}
