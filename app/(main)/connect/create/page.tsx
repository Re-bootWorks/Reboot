import PostCreateContainer from "@/features/connect/containers/PostCreateContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "커넥트",
};

export default function CreatePage() {
	return <PostCreateContainer />;
}
