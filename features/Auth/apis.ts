const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;

const baseHeaders = {
	"Content-Type": "application/json",
};

export async function postLogin(data: { email: string; password: string }) {
	return fetch(`${BASE_URL}/${TEAM_ID}/auth/login`, {
		method: "POST",
		headers: baseHeaders,
		body: JSON.stringify(data),
	});
}

export async function postSignUp(data: { email: string; password: string; name: string }) {
	return fetch(`${BASE_URL}/${TEAM_ID}/auth/signup`, {
		method: "POST",
		headers: baseHeaders,
		body: JSON.stringify(data),
	});
}
