// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-config-prettier/flat";
import prettierPlugin from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript"),
	{
		ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
	},
	...storybook.configs["flat/recommended"],
	prettier,
	{
		plugins: { prettier: prettierPlugin },
		rules: { "prettier/prettier": "warn" },
	},
];

export default eslintConfig;
