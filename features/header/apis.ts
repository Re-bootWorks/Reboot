import { clientFetch } from "@/libs/clientFetch";

export interface FavoritesCount {
	count: number;
}

export async function getFavoritesCount(): Promise<FavoritesCount> {
	const res = await clientFetch("/favorites/count");

	if (!res.ok) throw new Error("유저 정보 조회 실패");

	return res.json();
}
