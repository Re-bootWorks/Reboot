import Image from "next/image";

export default function Empty() {
	return (
		<div className="col-span-full flex flex-col items-center justify-center gap-y-5 md:gap-y-6">
			<Image src="/assets/img/img_empty.svg" alt="empty" width={120} height={72} />
			<p className={textStyle}>{`아직 모임이 없어요\n지금 바로 모임을 만들어보세요!`}</p>
		</div>
	);
}
const textStyle =
	"text-sm text-gray-500 md:text-base whitespace-pre-line text-center leading-5 tracking-[-0.32px]";
