module.exports = {
	root: true,
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:svelte/recommended",
		"prettier",
	],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 2020,
		extraFileExtensions: [".svelte"],
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	overrides: [
		{
			files: ["*.svelte"],
			parser: "svelte-eslint-parser",
			parserOptions: {
				parser: "@typescript-eslint/parser",
			},
		},
	],
	rules: {
		// "no-console": "warn",
		// "array-callback-return": 0,
		// eqeqeq: ["error", "always"],
		// "array-bracket-spacing": ["error", "never"],
		// "block-spacing": ["error", "always"],
		// "brace-style": "error",
		// camelcase: "error",
		// "comma-dangle": ["error", "always-multiline"],
		// "comma-spacing": ["error", { "before": false, "after": true }],
		// semi: ["error", "always"],
		// quotes: ["error", "double"],
	},
};
