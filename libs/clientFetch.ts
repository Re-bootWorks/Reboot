export async function clientFetch(endpoint: string, options: RequestInit = {}) {
	const { headers, ...rest } = options;

	const response = await fetch(`/api${endpoint}`, {
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
		credentials: "include",
		...rest,
	});

	return response;
}
