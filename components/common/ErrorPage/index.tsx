"use client";

import Button from "@/components/ui/Buttons/Button";
import Empty from "@/components/ui/Empty";

type ErrorPageProps = {
	onRetryAction: () => void;
	prefix?: string;
	title?: string;
	description?: string;
};

export default function ErrorPage({
	onRetryAction,
	prefix,
	title = "불러오지 못했습니다.",
	description = "잠시 후 다시 시도해주세요. \n 문제가 계속되면 새로고침 후 다시 확인해주세요.",
}: ErrorPageProps) {
	return (
		<Empty>
			<p>
				{prefix}
				{title}
			</p>
			<p>{description}</p>
			<Button sizes="small" className="mx-auto mt-4 w-30" onClick={onRetryAction}>
				다시 시도
			</Button>
		</Empty>
	);
}
