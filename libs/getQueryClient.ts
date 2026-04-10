import { environmentManager, QueryClient } from "@tanstack/react-query";

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
	if (environmentManager.isServer()) {
		return new QueryClient();
	}

	if (!browserQueryClient) {
		browserQueryClient = new QueryClient();
	}

	return browserQueryClient;
}
