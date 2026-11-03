# @iwsio/tsconfig

## Getting Started

### Standard TSConfig

This is used for general purpose Node based or server side applications.

```json
{
	"extends": "@iwsio/tsconfig",
	"compilerOptions": {
		"outDir": "./dist",
		"rootDir": "./src"
	},
	"include": ["src/**/*"],
}
```

### Browser (not JSX)

Extends base and includes `"lib": ["dom", "dom.iterable", "esnext"]`

```json
{
	"extends": "@iwsio/tsconfig/browser",
	"compilerOptions": {
		"outDir": "./dist",
		"rootDir": "./src"
	},
	"include": ["src/**/*"],

}
```

### JSX/React support

Includes `/browser` and adds `"jsx": "react-jsx"`

```json
{
	"extends": "@iwsio/tsconfig/react",
	"compilerOptions": {
		"outDir": "./dist",
		"rootDir": "./src"
	},
	"include": ["src/**/*"],

}
```

## Add Vitest Support

```json
{
	"compileOptions": {
		"types": [
			"vitest/globals",
			"@testing-library/jest-dom/vitest"
		]
	}
}
```
