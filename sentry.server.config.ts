// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";

const getEnvironmentConfig = () => {
	if (isProduction) {
		return {
			tracesSampleRate: 0.1,
			sampleRate: 1.0,
			enableLogs: false,
		};
	}

	if (isDevelopment) {
		return {
			tracesSampleRate: 1.0,
			sampleRate: 1.0,
			enableLogs: true,
			debug: true,
		};
	}
};

const config = getEnvironmentConfig();

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

	environment: process.env.NODE_ENV,

	...config,

	// Enable sending user PII (Personally Identifiable Information)
	// https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
	sendDefaultPii: false,
});
