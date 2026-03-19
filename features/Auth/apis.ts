export async function postLogin(data: { email: string; password: string }) {
	return fetch("https://dallaem-backend.vercel.app/dallaem/auth/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
}

export async function postSignUp(data: { email: string; password: string; name: string }) {
	return fetch("https://dallaem-backend.vercel.app/dallaem/auth/signup", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});
}
