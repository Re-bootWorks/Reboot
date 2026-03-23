"use client";

import CreateButton from "@/components/ui/Buttons/CreateButton";

export default function CreateOpenButton({ onClick }: { onClick: () => void }) {
	return <CreateButton onClick={onClick}>모임 만들기</CreateButton>;
}
