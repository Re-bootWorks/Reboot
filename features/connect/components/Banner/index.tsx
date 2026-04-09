"use client";

import { useEffect, useState, useRef } from "react";
import { useGetHotPosts } from "@/features/connect/queries";
import { cn } from "@/utils/cn";
import styles from "./index.module.css";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import IcThumbOutline from "@/components/ui/icons/IcThumbOutline";
import IcMessageOutline from "@/components/ui/icons/IcMessageOutline";

//  문구 목록
const TYPING_PHRASES = [
	"오늘 어떤 이야기를\n나눠볼까요?",
	"같은 취미, 같은 관심사\n함께해요",
	"당신의 이야기를\n들려주세요",
];

// marquee에 흘러가는 태그 목록
const MARQUEE_TAGS = [
	"#러닝",
	"#등산",
	"#사이클",
	"#요가",
	"#수영",
	"#헬스",
	"#스터디",
	"#독서모임",
	"#영어회화",
	"#자격증",
	"#코딩",
	"#맛집탐방",
	"#카페투어",
	"#여행",
	"#사진",
	"#요리",
	"#같이해요",
	"#모임구해요",
	"#주말모임",
	"#평일모임",
	"#온라인모임",
];

// 문구를 한 글자씩 타이핑/삭제 반복하는 커스텀 훅
function useTypingEffect(phrases: string[]) {
	const [displayed, setDisplayed] = useState("");
	const [phraseIdx, setPhraseIdx] = useState(0);
	const [charIdx, setCharIdx] = useState(0);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		const current = phrases[phraseIdx];
		const speed = isDeleting ? 40 : 80; // 삭제 시 더 빠르게 호다닥...!

		const timeout = setTimeout(() => {
			if (!isDeleting && charIdx === current.length) {
				// 타이핑 완료 → 2.2초 후 삭제 시작
				setTimeout(() => setIsDeleting(true), 2200);
				return;
			}
			if (isDeleting && charIdx === 0) {
				// 삭제 완료 → 다음 문구로 전환
				setIsDeleting(false);
				setPhraseIdx((prev) => (prev + 1) % phrases.length);
				return;
			}
			setCharIdx((prev) => prev + (isDeleting ? -1 : 1));
			setDisplayed(current.substring(0, charIdx + (isDeleting ? -1 : 1)));
		}, speed);

		return () => clearTimeout(timeout);
	}, [charIdx, isDeleting, phraseIdx, phrases]);

	return displayed;
}

export default function ConnectBanner({ className }: { className?: string }) {
	const { data } = useGetHotPosts();
	const posts = data?.data ?? [];
	const [postIdx, setPostIdx] = useState(0);
	const displayed = useTypingEffect(TYPING_PHRASES);
	const bannerRef = useRef<HTMLDivElement>(null);

	// 마우스 위치를 0~1 범위로 추적
	const mouseX = useMotionValue(0.5);
	const mouseY = useMotionValue(0.5);

	// 스프링 물리 적용 — 마우스를 따라 탄성 있게 움직임
	const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
	const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

	// 각 원마다 방향과 강도를 다르게 줘서 입체감 연출
	const x1 = useTransform(springX, [0, 1], [-24, 24]);
	const y1 = useTransform(springY, [0, 1], [-16, 16]);

	const x2 = useTransform(springX, [0, 1], [16, -16]); // 반대 방향
	const y2 = useTransform(springY, [0, 1], [10, -10]);

	const x3 = useTransform(springX, [0, 1], [-12, 12]);
	const y3 = useTransform(springY, [0, 1], [-20, 20]);

	const x4 = useTransform(springX, [0, 1], [20, -20]); // 반대 방향
	const y4 = useTransform(springY, [0, 1], [-12, 12]);

	// 마우스 이동 시 배너 내 상대 좌표를 0~1로 변환해서 저장
	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = bannerRef.current?.getBoundingClientRect();
		if (!rect) return;
		mouseX.set((e.clientX - rect.left) / rect.width);
		mouseY.set((e.clientY - rect.top) / rect.height);
	};

	// 마우스가 배너를 벗어나면 원 위치(중앙)로 복귀
	const handleMouseLeave = () => {
		mouseX.set(0.5);
		mouseY.set(0.5);
	};

	// 2.8초마다 HOT 게시글 슬라이드 전환 (최대 5개)
	useEffect(() => {
		if (!posts.length) return;
		const interval = setInterval(() => {
			setPostIdx((prev) => (prev + 1) % Math.min(posts.length, 5));
		}, 2800);
		return () => clearInterval(interval);
	}, [posts.length]);

	const currentPost = posts[postIdx];
	// marquee 무한 루프를 위해 태그 목록을 2배로 복제
	const doubled = [...MARQUEE_TAGS, ...MARQUEE_TAGS];

	return (
		<div
			ref={bannerRef}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			className={cn(
				"relative h-48 w-full shrink-0 overflow-hidden",
				"bg-gradient-to-br from-purple-100 to-purple-200",
				"md:h-[244px] md:rounded-3xl lg:rounded-4xl",
				className,
			)}>
			{/* 배경 장식 원 — 마우스 트래킹으로 각각 다른 방향/속도로 움직임 */}
			<motion.div
				style={{ x: x1, y: y1 }}
				className="absolute -top-8 -left-8 h-36 w-36 rounded-full bg-purple-300/30"
			/>
			<motion.div
				style={{ x: x2, y: y2 }}
				className="absolute -bottom-8 left-1/4 h-28 w-28 rounded-full bg-purple-300/20"
			/>
			<motion.div
				style={{ x: x3, y: y3 }}
				className="absolute -top-6 left-1/2 h-20 w-20 rounded-full bg-purple-200/40"
			/>
			<motion.div
				style={{ x: x4, y: y4 }}
				className="absolute -right-4 -bottom-4 h-32 w-32 rounded-full bg-purple-300/25 md:h-48 md:w-48"
			/>

			{/* 왼쪽 — 타이핑 텍스트 / 서브 문구 / marquee 태그 */}
			<div className="absolute top-1/2 right-4 left-4 z-[1] flex -translate-y-1/2 flex-col gap-3 md:right-auto md:left-10 lg:left-14">
				{/* 타이핑 애니메이션 텍스트 + 커서 */}
				<h1 className="min-h-[56px] text-lg leading-7 font-semibold tracking-[-0.36px] text-gray-900 md:min-h-[72px] md:text-[28px] md:leading-9 lg:min-h-[88px] lg:text-[34px] lg:leading-[1.2]">
					{displayed.split("\n").map((line, i) => (
						<span key={i}>
							{line}
							{i < displayed.split("\n").length - 1 && <br />}
						</span>
					))}
					{/* 깜빡이는 커서 */}
					<span className="ml-0.5 inline-block h-[1em] w-0.5 animate-pulse bg-purple-600 align-middle" />
				</h1>

				{/* 서브 문구 */}
				<p className="text-[12px] font-medium text-purple-700 md:text-[14px] lg:text-[15px]">
					같은 관심사를 가진 사람들과 자유롭게 소통해보세요
				</p>

				{/* marquee — 태그를 2배 복제해서 끊김 없이 무한 흐름 */}
				<div className="w-[260px] overflow-hidden md:w-[380px] lg:w-[460px]">
					<div className={styles.marquee}>
						{doubled.map((tag, i) => (
							<span
								key={i}
								className="rounded-full bg-purple-200 px-3 py-1 text-[11px] font-medium whitespace-nowrap text-purple-800 lg:px-4 lg:py-1.5 lg:text-[13px]">
								{tag}
							</span>
						))}
					</div>
				</div>
			</div>

			{/* 오른쪽 — HOT 게시글 슬라이드 카드 (md 이상에서만 노출) */}
			{currentPost && (
				<div className="absolute top-1/2 right-4 z-[1] hidden w-[180px] -translate-y-1/2 md:right-10 md:block md:w-[220px] lg:right-14 lg:w-[280px]">
					<div className="h-[130px] rounded-2xl border border-purple-200 bg-white/75 p-4 backdrop-blur-sm lg:h-[150px] lg:rounded-3xl lg:p-5">
						<div className="mb-2 flex items-center gap-1.5">
							<div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
							<p className="text-[11px] font-medium text-purple-700 lg:text-[13px]">
								요즘 핫한 게시글
							</p>
						</div>

						{/* 게시글 제목 — 전환 시 fade + slide 애니메이션 */}
						<div className="mb-3 h-[40px] overflow-hidden lg:h-[48px]">
							<AnimatePresence mode="popLayout">
								<motion.p
									key={postIdx}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.35, ease: "easeOut" }}
									className="line-clamp-2 overflow-hidden text-[13px] leading-5 font-medium text-gray-900 lg:text-[15px] lg:leading-6">
									{currentPost.title}
								</motion.p>
							</AnimatePresence>
						</div>

						<div className="flex items-center justify-between">
							{/* 좋아요 / 댓글 수 */}
							<div className="flex gap-3 text-[11px] text-purple-600 lg:text-[13px]">
								<div className="flex items-center gap-1">
									<IcThumbOutline size={13} color="purple-600" />
									<span>{currentPost.likeCount}</span>
								</div>
								<div className="flex items-center gap-1">
									<IcMessageOutline size={13} color="purple-600" />
									<span>{currentPost._count.comments}</span>
								</div>
							</div>

							{/* dot indicator — 현재 슬라이드 위치 표시 */}
							<div className="flex gap-1">
								{Array.from({ length: Math.min(posts.length, 5) }).map((_, i) => (
									<div
										key={i}
										className={cn(
											"h-1.5 rounded-full transition-all duration-300",
											i === postIdx ? "w-3.5 bg-purple-500" : "w-1.5 bg-purple-200",
										)}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
