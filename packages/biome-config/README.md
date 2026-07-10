# @iwsio/biome-config

Shared [Biome](https://biomejs.dev) configuration for IWS projects. Provides a common formatter and linter preset so packages and applications stay consistent.

## What's included

- **Formatter**: tabs, 120 line width, single quotes, semicolons as needed, no trailing commas
- **Linter**: `recommended` preset with additional `style`, `correctness`, and `complexity` rules enabled, and a few noisy `a11y`/`suspicious` rules disabled
- **Assist**: import organization enabled
- **CSS**: Tailwind directives parsing enabled
- **JSON**: formatter enabled (comments and trailing commas not allowed)
- **Overrides**: relaxed rules for test files (`*.test.*`, `__tests__`, `__mocks__`) and config files (`*.config.*`, `vite.config.mts`, `vitest.config.ts`)

The config is published with `"root": false`, so it's meant to be extended by a consuming `biome.json` rather than used on its own.

## Install

Install this package alongside its `@biomejs/biome` peer dependency:

```bash
pnpm add -D @iwsio/biome-config @biomejs/biome
```

> Peer dependency: `@biomejs/biome@^2.5.3`

## Usage

Extend the shared config from your project's `biome.json`:

```json
{
	"$schema": "https://biomejs.dev/schemas/2.5.3/schema.json",
	"extends": ["@iwsio/biome-config/biome"],
	"vcs": {
		"enabled": true,
		"clientKind": "git",
		"useIgnoreFile": true
	},
	"files": {
		"includes": [
			"**",
			"!**/node_modules",
			"!**/dist",
			"!**/coverage"
		]
	}
}
```

Root-only settings such as `vcs` and `files.includes` belong in the consuming config, since the shared config is non-root. You can further override any rule in the same file:

```json
{
	"extends": ["@iwsio/biome-config/biome"],
	"linter": {
		"rules": {
			"suspicious": {
				"noExplicitAny": "warn"
			}
		}
	}
}
```
