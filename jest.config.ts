import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
	dir: "./",
});

const config: Config = {
	coverageProvider: "v8",
	testEnvironment: "jest-fixed-jsdom",
	setupFilesAfterEnv: ["./jest.setup.ts"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/$1",
	},

	// CI 환경에서 .ENV 파일이 존재하지 않아, NEXT_PULBIC_API_URL 등 환경변수가 설정되지 않으면
	// 에러를 throw하여, 테스트 자체가 실행되지 않는 문제가 발생합니다.
	// 이를 방지하기 위해서 테스트 전용 더미 환경변수를 직접 설정하고자합니다.
	testEnvironmentOptions: {
		env: {
			NEXT_PUBLIC_API_URL: "http://localhost:3000",
			NEXT_PUBLIC_TEAM_ID: "test-team",
			NEXT_PUBLIC_KAKAO_JS_KEY: "test-kakao-key",
			KAKAO_REST_API_KEY: "test-rest-key",
			KAKAO_PLACE_API_URL: "https://dapi.kakao.com/v2/local/search/keyword.json",
		},
	},
};
const jestConfig = createJestConfig(config);

export default async () => {
	const resolvedConfig = await jestConfig();
	// https://github.com/mswjs/msw/issues/2599
	resolvedConfig.transformIgnorePatterns = ["/node_modules/.pnpm/(?!(msw|until-async)@)"];
	return resolvedConfig;
};
