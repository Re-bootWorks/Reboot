import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const texts = [
	{ name: "text-xs", size: 12, lineHeight: 16, letterSpacing: "-2%" },
	{ name: "text-sm", size: 14, lineHeight: 20, letterSpacing: "-2%" },
	{ name: "text-base", size: 16, lineHeight: 24, letterSpacing: "-2%" },
	{ name: "text-lg", size: 18, lineHeight: 28, letterSpacing: "-2%" },
	{ name: "text-xl", size: 20, lineHeight: 30, letterSpacing: "-2%" },
	{ name: "text-2xl", size: 24, lineHeight: 32, letterSpacing: "-2%" },
	{ name: "text-3xl", size: 28, lineHeight: 32, letterSpacing: "-3%" },
	{ name: "text-4xl", size: 30, lineHeight: 36, letterSpacing: "-2%" },
	{ name: "text-5xl", size: 32, lineHeight: 36, letterSpacing: "-2%" },
	{ name: "text-headline-md", size: 40, lineHeight: 56, letterSpacing: "-2%" },
	{ name: "text-headline-lg", size: 48, lineHeight: 60, letterSpacing: "-2%" },
	{ name: "text-headline-xl", size: 56, lineHeight: 68, letterSpacing: "-2%" },
];

const meta: Meta = {
	title: "Design Tokens/Typography",
	parameters: {
		docs: {
			description: {
				component: `
기본 폰트: Pretendard
포인트 폰트: Taenada

사용 예시:
- <p className="font-pretendard">본문</p>
- <h2 className="font-taenada">포인트 타이틀</h2>

        `,
			},
		},
	},
};
export default meta;

type Story = StoryObj;
export const FontFamilies: Story = {
	render: () => (
		<div className="space-y-6 p-6">
			<section className="space-y-2">
				<p className="text-sm text-gray-500">Default / Body</p>
				<p className="font-pretendard text-lg">Pretendard: 본문, 설명, UI 기본 텍스트</p>
			</section>

			<section className="space-y-2">
				<p className="text-sm text-gray-500">Accent / Display</p>
				<p className="font-taenada text-3xl">Taenada: 강조 문구</p>
			</section>

			<section className="space-y-2">
				<p className="text-sm text-gray-500">Accent / Display</p>
				<p className="font-tektur text-5xl">Tektur: 랜딩페이지 로고 문구</p>
			</section>
		</div>
	),
};

export const FontSizes: Story = {
	render: () => (
		<>
			<div className="rounded-lg border border-gray-700 bg-gray-800 p-4 text-purple-50">
				<span className="text-body-l">Font Family : Pretendard</span>
			</div>
			<table>
				{texts.map((t) => (
					<tr key={t.name} className={`${t.name}`}>
						<td className="w-1/4 p-4">{t.name}</td>
						<td className="w-1/4 p-4">size:{t.size}px</td>
						<td className="w-1/4 p-4">lineHeight:{t.lineHeight}px</td>
						<td className="w-1/4 p-4">letterSpacing:{t.letterSpacing}</td>
					</tr>
				))}
			</table>
		</>
	),
};
