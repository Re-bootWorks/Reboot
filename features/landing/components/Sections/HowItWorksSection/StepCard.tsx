"use client";

import Image from "next/image";
import { motion } from "motion/react";

type Step = {
	id: number;
	label: string;
	title: string;
	description: string;
	image: string;
	alt: string;
};

interface StepCardProps {
	steps: Step[];
	activeIndex: number;
}

const SLIDE_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function StepCard({ steps, activeIndex }: StepCardProps) {
	const activeStep = steps[activeIndex];

	return (
		<div className="relative rounded-4xl bg-white p-6 pb-8 shadow-[0_0_20px_0_rgba(0,0,0,0.25)] md:p-8 lg:pb-12 lg:pl-12">
			<div className="grid items-center gap-6 md:gap-7 lg:grid-cols-[minmax(0,1fr)_592px] lg:gap-12">
				<div className="relative order-2 lg:order-1">
					<div className="flex h-full flex-col justify-center">
						<div className="relative overflow-hidden">
							<motion.div
								key={`text-${activeStep.id}`}
								initial={{ x: -32, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{
									x: { duration: 0.45, ease: SLIDE_EASE },
									opacity: { duration: 0.18, ease: "linear" },
								}}>
								<div className="flex size-12 items-center justify-center rounded-lg bg-purple-500 text-xl font-bold text-white md:rounded-2xl md:text-2xl lg:size-16 lg:text-3xl">
									{String(activeStep.id).padStart(2, "0")}
								</div>

								<p className="mt-6 text-sm text-gray-700 lg:mt-8 lg:text-xl">{activeStep.label}</p>

								<h3 className="my-1 text-xl font-bold text-gray-900 md:text-3xl lg:my-4 lg:text-5xl">
									{activeStep.title}
								</h3>

								<p className="text-sm text-gray-600 md:text-base lg:text-xl">
									{activeStep.description}
								</p>
							</motion.div>
						</div>

						<div className="mt-8 flex gap-3 md:max-w-72.5">
							{steps.map((step, index) => {
								const isActive = index === activeIndex;

								return (
									<div
										key={step.id}
										className="relative h-1 flex-1 overflow-hidden rounded-full bg-gray-400 md:w-12.5">
										<motion.div
											className="absolute inset-y-0 left-0 rounded-full bg-purple-600"
											initial={false}
											animate={{
												width: isActive ? "100%" : "0%",
												opacity: isActive ? 1 : 0,
											}}
											transition={{ duration: 0.22, ease: "easeOut" }}
										/>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				<div className="relative order-1 h-51.5 overflow-hidden rounded-3xl bg-gray-50 md:h-58 lg:order-2 lg:h-[19rem]">
					<motion.div
						key={`image-${activeStep.id}`}
						className="absolute inset-0"
						initial={{ x: 32, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{
							x: { duration: 0.45, ease: SLIDE_EASE },
							opacity: { duration: 0.18, ease: "linear" },
						}}>
						<Image
							src={activeStep.image}
							alt={activeStep.alt}
							fill
							className="object-contain"
							priority={activeIndex === 0}
						/>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
