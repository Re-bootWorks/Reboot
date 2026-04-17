import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
	dir: "./",
});

const config: Config = {
	coverageProvider: "v8",
	testEnvironment: "jest-fixed-jsdom",
	/**
	 * setupFilesAfterEnv보다 먼저 실행되어 모든 모듈 import 전에 환경변수를 설정
	 * MSW 핸들러가 올바른 절대 URL로 등록되려면 반드시 이 시점에 환경변수가 필요
	 */
	setupFiles: ["./jest.env.ts"],
	setupFilesAfterEnv: ["./jest.setup.ts"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/$1",
	},
};
const jestConfig = createJestConfig(config);

export default async () => {
	const resolvedConfig = await jestConfig();
	// https://github.com/mswjs/msw/issues/2599
	resolvedConfig.transformIgnorePatterns = ["/node_modules/.pnpm/(?!(msw|until-async)@)"];
	return resolvedConfig;
};
