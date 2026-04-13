import captureIfServerError from "@/libs/captureIfServerError";

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

	captureIfServerError(response, endpoint, options.method ?? "GET");

	return response;
}
