// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

export const isProduction = process.env.NODE_ENV === "production";
export const isDevelopment = process.env.NODE_ENV === "development";

const getEnvironmentConfig = () => {
	if (isProduction) {
		return {
			// Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
			tracesSampleRate: 0.1,

			// Define how likely Replay events are sampled.
			// This sets the sample rate to be 10%. You may want this to be 100% while
			// in development and sample at a lower rate in production
			replaySessionSampleRate: 0.01,

			sampleRate: 1.0,

			// Enable logs to be sent to Sentry
			enableLogs: false,
		};
	}

	if (isDevelopment) {
		return {
			// Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
			tracesSampleRate: 1.0,

			// Define how likely Replay events are sampled.
			// This sets the sample rate to be 10%. You may want this to be 100% while
			// in development and sample at a lower rate in production
			replaySessionSampleRate: 0.1,

			sampleRate: 1.0,

			// Enable logs to be sent to Sentry
			enableLogs: true,
		};
	}
};

const config = getEnvironmentConfig();

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

	environment: process.env.NODE_ENV,

	...config,

	// Add optional integrations for additional features
	integrations: [Sentry.replayIntegration()],

	// Define how likely Replay events are sampled when an error occurs.
	replaysOnErrorSampleRate: 1.0,

	// Enable sending user PII (Personally Identifiable Information)
	// https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
	sendDefaultPii: false,

	// 트랜잭션 데이터 보내기 직전에 실행되는 메서드로 보낼 데이터를 필터링
	beforeSendTransaction(event) {
		const transactionName = event.transaction;

		const ignoredTransactions = ["/_next/static", "/favicon.ico"];

		if (ignoredTransactions.some((ignored) => transactionName?.includes(ignored))) {
			return null;
		}

		const duration = event.timestamp! - event.start_timestamp!;
		if (duration < 100) {
			return Math.random() < 0.01 ? event : null;
		}

		return event;
	},
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
