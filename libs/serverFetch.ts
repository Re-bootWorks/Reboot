import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID;

export async function serverFetch(endpoint: string, options: RequestInit = {}) {
	const { headers, ...rest } = options;

	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;

	const response = await fetch(`${BASE_URL}/${TEAM_ID}${endpoint}`, {
		headers: {
			"Content-Type": "application/json",
			...(accessToken && { Authorization: `Bearer ${accessToken}` }),
			...headers,
		},
		...rest,
	});

	return response;
}
