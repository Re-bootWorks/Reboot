import crypto from "crypto";
import { NextResponse } from "next/server";
import dayjs from "@/libs/dayjs";

const SENTRY_CLIENT_SECRET = process.env.SENTRY_CLIENT_SECRET;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN;
const PROJECT_NAME = "REBOOT";
const SENTRY_ORG_SLUG = "re-boot-4v";

function ellipsis(s: unknown, max = 300) {
	const str = String(s ?? "");
	return str.length > max ? `${str.slice(0, max - 1)}...` : str;
}

function colorByLevel(level?: string) {
	switch ((level || "").toLowerCase()) {
		case "fatal":
			return 0x8e44ad; // 보라
		case "error":
			return 0xe74c3c; // 빨강
		case "warning":
			return 0xf39c12; // 주황
		case "info":
			return 0x3498db; // 파랑
		case "debug":
			return 0x95a5a6; // 회색
		default:
			return 0x2ecc71; // 초록
	}
}

function emojiByLevel(level?: string) {
	switch ((level || "").toLowerCase()) {
		case "fatal":
			return "🟪";
		case "error":
			return "🟥";
		case "warning":
			return "🟧";
		case "info":
			return "🟦";
		case "debug":
			return "⬜";
		default:
			return "🟩";
	}
}

function compactDate(d?: string) {
	if (!d) return undefined;
	return dayjs(d).tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
}

function pickTopFrame(event: SentryEvent | undefined) {
	const entry = (event?.entries || []).find((e) => e?.type === "exception");
	const values = entry?.data?.values || event?.exception?.values || [];
	const ex = values[values.length - 1] || values[0];
	const frames = ex?.stacktrace?.frames || [];
	if (!frames.length) return undefined;

	const frame = [...frames].reverse().find((f) => f?.in_app) || frames[frames.length - 1];
	const location = [frame?.fileName || frame?.abs_path || "?", frame?.lineno ?? "?"]
		.filter(Boolean)
		.join(":");

	const func = frame?.function || "(annoymous)";
	return { location, func };
}

function extract(body: SentryWebhookBody) {
	const issue = body?.data?.issue ?? body?.issue;
	const event = body?.data?.event ?? body?.event;

	const project = PROJECT_NAME;
	const level = (event?.level ?? issue?.level ?? "error").toLowerCase();
	const environment =
		event?.environment ?? issue?.environment ?? body?.data?.environment ?? "unknown";
	const release =
		event?.release ?? event?.contexts?.app?.version ?? issue?.firstRelease?.version ?? undefined;
	const user = event?.user?.email || event?.user?.username || event?.user?.id || undefined;
	const shortId = issue?.shortId ?? undefined;

	const issueUrl = issue?.url ?? event?.issue_url ?? event?.web_url ?? undefined;
	const culprit = event?.culprit ?? issue?.culprit ?? undefined;
	const message = event?.title ?? event?.message ?? issue?.title ?? "Unknown error";

	const counts = {
		count: issue?.count ? String(issue.count) : undefined,
		users: issue?.userCount ? String(issue.userCount) : undefined,
		firstSeen: compactDate(issue?.firstSeen),
		lastSeen: compactDate(issue?.lastSeen),
	};
	const top = pickTopFrame(event);

	return {
		project,
		level,
		environment,
		release,
		user,
		shortId,
		issueUrl,
		culprit,
		message,
		counts,
		top,
	};
}

async function fetchIssueData(issueId: string): Promise<IssueData | null> {
	if (!SENTRY_AUTH_TOKEN) return null;
	const res = await fetch(
		`https://sentry.io/api/0/organizations/${SENTRY_ORG_SLUG}/issues/${issueId}/`,
		{ headers: { Authorization: `Bearer ${SENTRY_AUTH_TOKEN}` } },
	).catch(() => null);
	if (!res?.ok) return null;
	return res.json();
}

async function postToDiscord(payload: object) {
	if (!DISCORD_WEBHOOK_URL) throw new Error("DISCORD_WEBHOOK_URL not set");
	const res = await fetch(DISCORD_WEBHOOK_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`Discord webhook failed: ${res.status} ${text}`);
	}
}

export async function POST(req: Request) {
	if (!SENTRY_CLIENT_SECRET || !DISCORD_WEBHOOK_URL) {
		return NextResponse.json(
			{ error: "SENTRY_CLIENT_SECRET or DISCORD_WEBHOOK_URL not set" },
			{ status: 500 },
		);
	}

	const rawBody = await req.text();

	let body;
	try {
		body = JSON.parse(rawBody);
	} catch {
		return NextResponse.json(
			{ error: "Sentry에서 보낸 데이터가 유효하지 않습니다." },
			{ status: 400 },
		);
	}

	const signature = req.headers.get("sentry-hook-signature");
	const hmac = crypto.createHmac("sha256", SENTRY_CLIENT_SECRET);

	hmac.update(rawBody, "utf8");

	const digest = hmac.digest("hex");

	if (digest !== signature) {
		return NextResponse.json(
			{ error: "HMAC 검증에 실패했습니다. 데이터가 변조되었을 수 있습니다." },
			{ status: 401 },
		);
	}

	try {
		const extracted = extract(body);
		let { counts } = extracted;
		const { project, level, environment, release, user, shortId, issueUrl, culprit, message, top } =
			extracted;

		const issueId = body?.data?.event?.issue_id;
		if (issueId) {
			const issueData = await fetchIssueData(String(issueId));
			if (issueData) {
				counts = {
					count: issueData.count ? String(issueData.count) : undefined,
					users: issueData.userCount ? String(issueData.userCount) : undefined,
					firstSeen: compactDate(issueData.firstSeen),
					lastSeen: compactDate(issueData.lastSeen),
				};
			}
		}

		const levelEmoji = emojiByLevel(level);
		const title = shortId
			? `${levelEmoji} [${project}] ${ellipsis(message, 190)} • ${shortId}`
			: `${levelEmoji} [${project}] ${ellipsis(message, 220)}`;

		const lines: string[] = [];
		if (culprit) lines.push(`**원인**: \`${ellipsis(culprit, 180)}\``);
		if (top) lines.push(`**발생 위치**: \`${ellipsis(`${top.location} · ${top.func}`, 220)}\``);
		const description = lines.join("\n");

		const fields = [
			environment && { name: "환경", value: `\`${environment}\``, inline: true },
			release && { name: "릴리즈(커밋)", value: `\`${ellipsis(release, 8)}\``, inline: true },
			user && { name: "유저", value: `\`${ellipsis(user, 60)}\``, inline: true },
			counts.count && { name: "발생 횟수", value: `\`${counts.count}\``, inline: true },
			counts.users && { name: "영향 유저 수", value: `\`${counts.users}\``, inline: true },
			counts.firstSeen && { name: "최초 발생", value: `\`${counts.firstSeen}\``, inline: true },
			issueUrl && { name: "이슈", value: `[Open in Sentry](${issueUrl})`, inline: false },
		].filter(Boolean) as Array<{ name: string; value: string; inline?: boolean }>;

		const embed = {
			title,
			url: issueUrl,
			description: ellipsis(description, 3900),
			color: colorByLevel(level),
			timestamp: new Date().toISOString(),
			footer: { text: `Sentry → Discord • ${project}` },
			fields,
			author: {
				name: "Sentry Alert",
				url: issueUrl,
				icon_url:
					"https://raw.githubusercontent.com/getsentry/sentry-docs/main/src/images/favicon.png",
			},
		};
		await postToDiscord({ username: "Sentry Bot", embeds: [embed] });
		return NextResponse.json({ ok: true });
	} catch (err) {
		console.error("❌ Sentry Webhook 처리 실패:", err);
		return new NextResponse("fail", { status: 200 });
	}
}
