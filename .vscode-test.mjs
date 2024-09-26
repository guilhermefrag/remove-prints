import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
  label: 'unitTests',
	files: 'out/test/**/*.test.js',
	version: 'insiders',
	workspaceFolder: './',
	mocha: {
		ui: 'tdd',
		timeout: 20000
	}
});
