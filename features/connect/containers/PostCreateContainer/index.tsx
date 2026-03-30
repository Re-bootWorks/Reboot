"use client";

import { useState } from "react";
import Button from "@/components/ui/Buttons/Button";
import Container from "@/components/layout/Container";

export default function PostCreateContainer() {
	const [title, setTitle] = useState("");

	return (
		<Container narrow>
			<div className="space-y-4">
				{/* 제목 */}
				<div className="flex items-center gap-2">
					<div className="relative min-w-0 flex-1">
						<input
							value={title}
							onChange={(e) => {
								if (e.target.value.length <= 30) {
									setTitle(e.target.value);
								}
							}}
							placeholder="제목을 입력해주세요"
							className="w-full border-b border-gray-200 bg-transparent px-2 py-1.5 text-base leading-6 font-semibold tracking-[-0.32px] outline-none placeholder:text-gray-400"
						/>

						<span className="absolute top-1/2 right-2 -translate-y-1/2 text-sm text-gray-400">
							{title.length}/30
						</span>
					</div>

					<Button className="h-[40px] w-[80px] shrink-0 rounded-[10px] bg-gray-100 px-4 text-gray-600 hover:bg-gray-100 hover:text-gray-400">
						등록
					</Button>
				</div>

				{/* 에디터 카드 추가 */}
				<div className="rounded-[32px] bg-gray-50 p-4">
					<div className="flex h-[670px] flex-col rounded-[24px] bg-white p-4">
						{/* toolbar 자리 */}
						<div className="flex w-fit items-center gap-2 rounded-full bg-gray-100 px-3 py-2">
							<p>내친구 진석이</p>
						</div>

						{/* 본문 */}
						<textarea
							placeholder="본문 내용을 입력해주세요"
							className="mt-4 w-full flex-1 resize-none text-base text-gray-700 outline-none"
						/>

						{/* 글자수 */}
						<div className="mt-2 text-xs text-gray-400">공백포함 : 0자 | 공백제외 : 0자</div>
					</div>
				</div>
			</div>
		</Container>
	);
}
