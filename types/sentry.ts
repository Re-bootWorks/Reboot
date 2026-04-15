interface SentryUser {
	email?: string;
	username?: string;
	id?: string;
}

interface SentryFrame {
	fileName?: string;
	abs_path?: string;
	lineno?: number;
	function?: string;
	in_app?: boolean;
}

interface SentryException {
	stacktrace?: { frames: SentryFrame[] };
}

interface SentryEntry {
	type: string;
	data?: { values?: SentryException[] };
}

interface SentryEvent {
	level?: string;
	title?: string;
	message?: string;
	environment?: string;
	release?: string;
	culprit?: string;
	user?: SentryUser;
	tags?: Array<[string, string]> | Record<string, string>;
	entries?: SentryEntry[];
	exception?: { values?: SentryException[] };
	contexts?: { app?: { version?: string } };
	issue_url?: string;
	web_url?: string;
	issue_id?: string;
}

interface SentryIssue {
	level?: string;
	title?: string;
	environment?: string;
	shortId?: string;
	url?: string;
	culprit?: string;
	count?: number;
	userCount?: number;
	firstSeen?: string;
	lastSeen?: string;
	firstRelease?: { version?: string };
	project?: { name?: string; slug?: string };
}

interface SentryWebhookBody {
	data?: {
		event?: SentryEvent;
		issue?: SentryIssue;
		environment?: string;
	};
	event?: SentryEvent;
	issue?: SentryIssue;
	project?: string;
	url?: string;
}

interface IssueData {
	count?: number;
	userCount?: number;
	firstSeen?: string;
	lastSeen?: string;
}
