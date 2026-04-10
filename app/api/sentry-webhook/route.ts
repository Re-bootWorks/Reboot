import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const SENTRY_CLIENT_SECRET = process.env.SENTRY_CLIENT_SECRET;
	const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

	if (!SENTRY_CLIENT_SECRET || !DISCORD_WEBHOOK_URL) {
		return NextResponse.json(
			{ error: "SENTRY_CLIENT_SECRET or DISCORD_WEBHOOK_URL not Existed" },
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

	const resource = req.headers.get("sentry-hook-resource");
	let message;

	if (resource === "event_alert" && body.action === "triggered") {
		const event = body.data.event;
		message = {
			embeds: [
				{
					title: `알림: ${event.title}`,
					description: event.web_url
						? `[이벤트 ID: ${event.event_id}](${event.web_url})`
						: event.title,
					fields: [
						{
							name: "프로젝트",
							value: event.project ? `Project ID: ${event.project}` : "Unknown",
							inline: true,
						},
						{
							name: "규칙",
							value: body.data.triggered_rule || "Unknown",
							inline: true,
						},
						{
							name: "에러 타입",
							value: event.metadata?.type || "Unknown",
							inline: true,
						},
						{
							name: "레벨",
							value: event.level || "Unknown",
							inline: true,
						},
					],
					color: 0x7566e5,
				},
			],
		};
	} else {
		return NextResponse.json({ message: "무시된 이벤트" });
	}

	try {
		const response = await fetch(DISCORD_WEBHOOK_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(message),
		});
		if (!response.ok) {
			throw new Error(`웹 훅 전송에 실패했습니다: ${response.status}`);
		}
	} catch {
		return NextResponse.json({ error: "웹 훅 전송에 실패했습니다." }, { status: 500 });
	}

	return NextResponse.json({ message: "웹 훅 전송 완료." });
}
