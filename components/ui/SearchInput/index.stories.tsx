import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import SearchInput from "./index";

const meta: Meta<typeof SearchInput> = {
	title: "UI/SearchInput",
	component: SearchInput,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "outlined"],
			description: "검색 입력 필드 스타일",
		},
		placeholder: {
			control: "text",
			description: "플레이스홀더 텍스트",
		},
		disabled: {
			control: "boolean",
			description: "비활성화 상태",
		},
	},
};

export default meta;

type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
	render: (args) => {
		const [value, setValue] = useState("");

		return (
			<SearchInput
				{...args}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onSearchClick={() => console.log("검색:", value)}
				onClear={() => setValue("")}
			/>
		);
	},
	args: {
		placeholder: "궁금한 내용을 검색해보세요.",
		variant: "default",
	},
};

export const Outlined: Story = {
	render: (args) => {
		const [value, setValue] = useState("");

		return (
			<SearchInput
				{...args}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onSearchClick={() => console.log("검색:", value)}
				onClear={() => setValue("")}
			/>
		);
	},
	args: {
		placeholder: "궁금한 내용을 검색해보세요.",
		variant: "outlined",
	},
};

export const Disabled: Story = {
	render: (args) => {
		const [value, setValue] = useState("");

		return (
			<SearchInput
				{...args}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onSearchClick={() => console.log("검색:", value)}
				onClear={() => setValue("")}
			/>
		);
	},
	args: {
		placeholder: "궁금한 내용을 검색해보세요.",
		variant: "default",
		disabled: true,
	},
};

export const WithDefaultValue: Story = {
	render: (args) => {
		const [value, setValue] = useState("Next.js");

		return (
			<SearchInput
				{...args}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onSearchClick={() => console.log("검색:", value)}
				onClear={() => setValue("")}
			/>
		);
	},
	args: {
		placeholder: "궁금한 내용을 검색해보세요.",
		variant: "default",
	},
};

export const Interactive: Story = {
	render: () => {
		const [value, setValue] = useState("");

		const handleSearch = () => {
			alert(`검색: ${value}`);
		};

		const handleClear = () => {
			setValue("");
		};

		return (
			<SearchInput
				placeholder="검색어를 입력하세요"
				variant="default"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onSearchClick={handleSearch}
				onClear={handleClear}
			/>
		);
	},
};

export const WithClearButton: Story = {
	render: () => {
		const [value, setValue] = useState("Next.js");

		const handleSearch = () => {
			alert(`검색: ${value}`);
		};

		const handleClear = () => {
			setValue("");
		};

		return (
			<SearchInput
				placeholder="검색어를 입력하세요"
				variant="default"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onSearchClick={handleSearch}
				onClear={handleClear}
			/>
		);
	},
};

export const OutlinedInteractive: Story = {
	render: () => {
		const [value, setValue] = useState("");

		return (
			<SearchInput
				placeholder="궁금한 내용을 검색해보세요."
				variant="outlined"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onSearchClick={() => alert(`검색: ${value}`)}
				onClear={() => setValue("")}
			/>
		);
	},
};
