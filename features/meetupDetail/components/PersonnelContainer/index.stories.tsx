import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PersonnelContainer from "./index";
import { mockParticipants } from "./mocks";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			staleTime: Infinity,
			gcTime: Infinity,
		},
	},
});

const meta: Meta<typeof PersonnelContainer> = {
	title: "Features/MeetupDetail/PersonnelContainer",
	component: PersonnelContainer,
	tags: ["autodocs"],
	argTypes: {
		capacity: { control: "number" },
		participantCount: { control: false },
	},
	decorators: [
		(Story) => (
			<QueryClientProvider client={queryClient}>
				<Story />
			</QueryClientProvider>
		),
	],
};

export default meta;

type Story = StoryObj<typeof PersonnelContainer>;

const injectMockData = (meetingId: number, data: unknown[]) => {
	const queryKey = ["meetupDetail", "participants", meetingId];
	queryClient.setQueryDefaults(queryKey, { queryFn: () => data });
	queryClient.setQueryData(queryKey, {
		pages: [{ data: data }],
		pageParams: [undefined],
	});
};

const defaultArgs = {
	meetingId: 1,
	hostId: 100,
	capacity: 10,
	participantCount: 5,
};

export const Default: Story = {
	args: {
		...defaultArgs,
	},
	render: (args) => {
		injectMockData(args.meetingId, mockParticipants.slice(0, 5));
		return <PersonnelContainer {...args} />;
	},
};

export const Full: Story = {
	args: {
		...defaultArgs,
		participantCount: 10,
	},
	render: (args) => {
		injectMockData(args.meetingId, mockParticipants.slice(0, 10));
		return <PersonnelContainer {...args} />;
	},
};

export const AlmostFull: Story = {
	args: {
		...defaultArgs,
		participantCount: 9,
	},
	render: (args) => {
		injectMockData(args.meetingId, mockParticipants.slice(0, 9));
		return <PersonnelContainer {...args} />;
	},
};
