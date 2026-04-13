import { CategoryItem } from "../data";

export default function CategoryCard({
	title,
	tags,
	icon: Icon,
	cardClassName,
	tagClassName,
}: CategoryItem) {
	return (
		<article
			className={`group hover:-translate-y-0.2 relative flex shrink-0 flex-col items-center gap-3 overflow-hidden rounded-3xl p-6 shadow-[0_4px_16px_0_rgba(0,0,0,0.04)] transition-all duration-400 ease-out hover:shadow-[-6px_10px_18px_rgba(0,0,0,0.06),6px_10px_18px_rgba(0,0,0,0.06),0_14px_22px_rgba(0,0,0,0.08)] md:flex-row md:justify-between md:p-8 lg:gap-6 ${cardClassName}`}>
			<div className="backdrop-blur-0 pointer-events-none absolute inset-0 rounded-3xl bg-white/0 transition-all duration-400 ease-out group-hover:bg-white/10 group-hover:backdrop-blur-[2px]" />

			<div className="relative z-10 flex size-25 shrink-0 items-center justify-center rounded-3xl bg-white/50 transition-all duration-400 ease-out group-hover:scale-105 group-hover:bg-white/70 lg:size-35">
				<Icon />
			</div>

			<div className="relative z-10">
				<h3 className="group-hover:-translate-y-0.2 text-center text-base font-bold text-gray-900 transition-all duration-400 ease-out md:text-start md:text-lg lg:text-2xl">
					{title}
				</h3>

				<div className="mt-3 flex flex-col items-center gap-1.5 md:mt-8 md:items-start lg:flex-row">
					{tags.map((tag: string) => (
						<span
							key={tag}
							className={`block w-fit shrink-0 rounded-full border bg-white/50 px-3 py-1 text-xs whitespace-nowrap transition-all duration-400 ease-out group-hover:bg-white/80 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] ${tagClassName}`}>
							{tag}
						</span>
					))}
				</div>
			</div>
		</article>
	);
}
