import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./index";
import { StatusLabel } from "@/components/ui/StatusLabel";

const meta: Meta<typeof Badge> = {
	title: "UI/Badge",
	component: Badge,
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["scheduled", "pending", "completed", "confirmed", "completedAlt"],
		},
	},
	render: ({ variant }) => {
		if (variant === "confirmed") {
			return (
				<Badge variant={variant}>
					<StatusLabel>개설 확정</StatusLabel>
				</Badge>
			);
		}

		const labelMap: Record<string, string> = {
			scheduled: "이용 예정",
			pending: "개설 대기",
			completed: "이용 완료",
			completedAlt: "이용 완료",
		};

		return <Badge variant={variant}>{labelMap[variant ?? "scheduled"]}</Badge>;
	},
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Scheduled: Story = {
	args: { variant: "scheduled" },
};

export const Pending: Story = {
	args: { variant: "pending" },
};

export const Completed: Story = {
	args: { variant: "completed" },
};

export const Confirmed: Story = {
	args: { variant: "confirmed" },
};

export const CompletedAlt: Story = {
	args: { variant: "completedAlt" },
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-wrap gap-3">
			<Badge variant="scheduled">이용 예정</Badge>
			<Badge variant="pending">개설 대기</Badge>
			<Badge variant="completed">이용 완료</Badge>
			<Badge variant="confirmed">
				<StatusLabel>개설확정</StatusLabel>
			</Badge>
			<Badge variant="completedAlt">이용 완료</Badge>
		</div>
	),
};
