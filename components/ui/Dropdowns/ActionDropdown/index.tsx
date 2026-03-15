import { cn } from "@/utils/cn";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { cva } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { IcMeetBalls, IcPerson } from "../../icons";

const menuVariants = cva(
	[
		"min-w-27.5 rounded-xl border border-gray-200 bg-white shadow-base",
		"outline-none",
		"data-[closed]:scale-95 data-[closed]:opacity-0",
		"transition duration-150 ease-out",
	].join(" "),
);

const itemVariants = cva(
	[
		"flex w-full h-10 items-center px-2 text-left text-sm font-semibold text-gray-800 cursor-pointer",
		"focus:outline-none",
		"data-[focus]:rounded-lg data-[focus]:bg-gray-50",
		"disabled:cursor-not-allowed disabled:text-gray-300",
	].join(" "),
	{
		variants: {
			danger: {
				true: "text-error",
				false: "",
			},
		},
		defaultVariants: {
			danger: false,
		},
	},
);

export type ActionDropdownItem = {
	label: string;
	onClick: () => void;
	disabled?: boolean;
	danger?: boolean;
	className?: string;
};

interface ActionDropdownProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
	items: ActionDropdownItem[];
	menuClassName?: string;
	triggerClassName?: string;
	triggerType?: "actions" | "profile";
	actionsSize?: "md" | "xl"; // md: 24, xl: 40
}

export default function ActionDropdown({
	items,
	className,
	menuClassName,
	triggerClassName,
	triggerType = "actions",
	actionsSize = "md",
	type,
	...props
}: ActionDropdownProps) {
	const ariaLabel = triggerType === "profile" ? "프로필 메뉴 열기" : "액션 메뉴 열기";

	return (
		<Menu as="div" className={cn("relative inline-block", className)}>
			<MenuButton
				type={type ?? "button"}
				className={cn("cursor-pointer outline-none", triggerClassName)}
				{...props}>
				<span className="sr-only">{ariaLabel}</span>
				{triggerType === "profile" ? (
					<IcPerson size="xxl" className="rounded-full border border-gray-200 bg-gray-50" />
				) : (
					<IcMeetBalls size={actionsSize} />
				)}
			</MenuButton>

			<MenuItems
				transition
				anchor="bottom end"
				className={cn(menuVariants(), "mt-2", menuClassName)}>
				<div className="flex flex-col">
					{items.map((item, index) => (
						<MenuItem
							key={`${item.label}-${index}`}
							as="button"
							type="button"
							onClick={item.onClick}
							disabled={item.disabled}
							className={cn(
								itemVariants({
									danger: item.danger,
								}),
								item.className,
							)}>
							{item.label}
						</MenuItem>
					))}
				</div>
			</MenuItems>
		</Menu>
	);
}
