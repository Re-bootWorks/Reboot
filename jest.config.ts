import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
	dir: "./",
});

const config: Config = {
	coverageProvider: "v8",
	testEnvironment: "jest-fixed-jsdom",
	setupFilesAfterEnv: ["./jest.setup.ts"],
};
const jestConfig = createJestConfig(config);

export default async () => {
	const resolvedConfig = await jestConfig();
	// https://github.com/mswjs/msw/issues/2599
	resolvedConfig.transformIgnorePatterns = ["/node_modules/.pnpm/(?!(msw|until-async)@)"];
	return resolvedConfig;
};
