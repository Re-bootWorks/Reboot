const IMAGE_MARKER = "__IMAGE__";

export function parseCommentContent(content: string) {
	return content.split("\n").map((line) => {
		if (line.startsWith(IMAGE_MARKER)) {
			return { type: "image" as const, url: line.replace(IMAGE_MARKER, "") };
		}
		return { type: "text" as const, text: line };
	});
}

export function buildCommentContent(text: string, imageUrl?: string) {
	if (!imageUrl) return text;
	return `${text}\n${IMAGE_MARKER}${imageUrl}`;
}
