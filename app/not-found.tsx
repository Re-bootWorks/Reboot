import Link from "next/link";

export default function NotFound() {
	return (
		<main className="min-h-screen bg-gray-50 px-4 pt-20 pb-16 md:px-6 md:pt-24 md:pb-20 lg:px-10 lg:pt-28">
			<div className="mx-auto flex w-full max-w-7xl items-center justify-center">
				<section className="shadow-base relative flex w-full max-w-[45rem] flex-col items-center justify-center overflow-hidden rounded-4xl bg-white p-8 text-center md:rounded-[40px] md:px-14 md:py-16">
					<div className="pointer-events-none absolute -top-10 -left-10 h-24 w-24 rounded-full bg-purple-100 opacity-80 blur-2xl md:h-32 md:w-32" />
					<div className="pointer-events-none absolute -right-10 -bottom-10 h-24 w-24 rounded-full bg-purple-100 opacity-60 blur-2xl md:h-36 md:w-36" />

					<div className="pointer-events-none absolute top-[15%] left-[10%] h-2.5 w-2.5 rounded-full bg-orange-300 md:h-3 md:w-3" />
					<div className="pointer-events-none absolute top-[30%] right-[18%] h-2 w-2 rounded-full bg-green-400 md:h-2.5 md:w-2.5" />
					<div className="pointer-events-none absolute bottom-[22%] left-[20%] h-2 w-2 rounded-full bg-purple-200 md:h-2.5 md:w-2.5" />

					<div className="bg-gradient-purple-100-lr relative mx-auto flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-full md:h-40 md:w-40">
						<span className="text-[10px] font-semibold tracking-[0.24em] whitespace-nowrap text-purple-500 uppercase md:text-xs">
							not found
						</span>
						<span className="mt-1 text-5xl leading-none font-bold text-purple-600 md:text-7xl">
							404
						</span>
					</div>

					<div className="relative mt-8 md:mt-10">
						<h1 className="text-2xl font-bold text-gray-900 md:text-5xl">
							앗, 찾으시는 페이지가 없어요
						</h1>
						<p className="mt-3 text-sm text-gray-600 md:mt-4 md:text-lg">
							잘못된 주소이거나 페이지가 이동되었어요
						</p>
					</div>

					<div className="mt-8 md:mt-10">
						<Link
							href="/"
							className="inline-flex h-12 items-center justify-center rounded-full bg-purple-600 px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 md:h-14 md:px-8 md:text-base">
							홈으로 돌아가기
						</Link>
					</div>
				</section>
			</div>
		</main>
	);
}
