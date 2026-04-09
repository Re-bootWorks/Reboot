import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Participants } from "./index";
import { mockParticipants } from "@/features/meetupDetail/components/PersonnelContainer/mocks";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			staleTime: Infinity,
			gcTime: Infinity,
		},
	},
});

const meta: Meta<typeof Participants> = {
	title: "UI/Participants",
	component: Participants,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<QueryClientProvider client={queryClient}>
				<Story />
			</QueryClientProvider>
		),
	],
};

export default meta;

type Story = StoryObj<typeof Participants>;

const injectMockData = (meetingId: number, data: unknown[]) => {
	const queryKey = ["meetupDetail", "participants", meetingId];
	queryClient.setQueryDefaults(queryKey, { queryFn: () => data });
	queryClient.setQueryData(queryKey, {
		pages: [{ data: data }],
		pageParams: [undefined],
	});
};

export const FewParticipants: Story = {
	name: "4명 이하 (개별 이미지)",
	args: {
		meetingId: 1,
		participantCount: 3,
		hostId: 100,
	},
	render: (args) => {
		injectMockData(args.meetingId, mockParticipants.slice(0, 3));
		return <Participants {...args} />;
	},
};

export const ExactlyFour: Story = {
	name: "4명 (경계값)",
	args: {
		meetingId: 2,
		participantCount: 4,
		hostId: 100,
	},
	render: (args) => {
		injectMockData(args.meetingId, mockParticipants.slice(0, 4));
		return <Participants {...args} />;
	},
};

export const ManyParticipants: Story = {
	name: "5명 이상 (+N 표시)",
	args: {
		meetingId: 3,
		participantCount: 6,
		hostId: 100,
	},
	render: (args) => {
		injectMockData(args.meetingId, mockParticipants.slice(0, 6));
		return <Participants {...args} />;
	},
};
