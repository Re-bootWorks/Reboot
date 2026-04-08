import { RefObject } from "react";
import useScrollVisibility from "@/hooks/useScrollVisibility";
import { IcArrowUp } from "../../icons";

type ScrollTopButtonProps = {
	threshold?: number;
	targetRef?: RefObject<HTMLElement | null>;
};

export default function ScrollTopButton({ threshold = 100, targetRef }: ScrollTopButtonProps) {
	const isVisible = useScrollVisibility({ threshold, targetRef });

	function scrollToTop() {
		if (targetRef?.current) {
			targetRef.current.scrollTo({
				top: 0,
				behavior: "smooth",
			});
			return;
		}

		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}

	if (!isVisible) return null;

	return (
		<button
			type="button"
			className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-purple-500"
			onClick={scrollToTop}
			aria-label="최상단으로 이동">
			<IcArrowUp />
		</button>
	);
}
