"use client";

import { RefObject } from "react";
import { AnimatePresence, motion } from "motion/react";
import useScrollVisibility from "@/hooks/useScrollVisibility";
import { IcChevronUp } from "@/components/ui/icons";
import { cn } from "@/utils/cn";

type ScrollTopButtonProps = {
	threshold?: number;
	targetRef?: RefObject<HTMLElement | null>;
	className?: string;
};

export default function ScrollTopButton({
	threshold = 100,
	targetRef,
	className,
}: ScrollTopButtonProps) {
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

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.button
					type="button"
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 12 }}
					transition={{ duration: 0.18, ease: "linear" }}
					className={cn(
						"fixed right-6 bottom-6 z-10 flex size-12 cursor-pointer items-center justify-center rounded-full bg-purple-500 shadow-[0_8px_16px_rgba(0,0,0,0.4)]",
						className,
					)}
					onClick={scrollToTop}
					aria-label="최상단으로 이동">
					<IcChevronUp size={"lg"} />
				</motion.button>
			)}
		</AnimatePresence>
	);
}
