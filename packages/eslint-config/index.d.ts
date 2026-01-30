import type { ConfigArray } from '@eslint/config-array'
export { ConfigArray }
export interface CustomizeOptions {
	/**
	 * Include TypeChecked rules
	 */
	includeTypeChecked?: boolean
	/**
	 * List of glob patterns for files that should be type-checked.
	 * Only used if `includeTypeChecked` is true.
	 *
	 * Default assumes only type checked files exist in 'src/*' files; this intentionally ignores files outside of src like vite.config.ts or setupFiles.ts
	 */
	includeTypeCheckedFiles: string[]
	/**
	 * If true, enables React specific rules and plugins.
	 * This is useful for non-React projects or when using a different framework.
	 * Default is true.
	 */
	includeReact?: boolean
	/**
	 * If true, enables Tailwind CSS specific rules and plugins.
	 * This is useful for projects that use Tailwind CSS.
	 * Default is true.
	 */
	includeTailwind?: boolean
	/**
	 * Manually specify the list of package names that can be imported among workspaces in the monorepo.
	 */
	monoRepoPackages?: string[]
	/**
	 * List of Node.JS specific projects (paths relative to root) in this monorepo to apply Node specific rules
	 */
	monoRepoNodeProjects?: string[]
	/**
	 * Stylistic factory customization options.
	 *
	 * See: https://github.com/eslint-stylistic/eslint-stylistic/blob/main/packages/eslint-plugin/dts/options.d.ts
	 */
	stylisticInit?: import('@stylistic/eslint-plugin').StylisticCustomizeOptions

	/**
	 * Additional global ignores
	 */
	ignores?: string[]
	/**
	 * Additional ESLint configs to append to the final config. Use this for custom rules at specific paths.
	 */
	appendConfigs?: ConfigArray
	/**
	 * Prints active configuration to the console when running lint.
	 *
	 * This uses `console.dir` (may be hidden from console output)
	 */
	debug?: boolean

	/**
	 * If true, automatically determines package names AND node project workspace paths in the monorepo via pnpm-workspace.yaml or package.json workspaces field.
	 *
	 * Requires `rootDir` property to be set.
	 *
	 * Overrides `monoRepoPackages` and `monoRepoNodeProjects`
	 *
	 * Use `excludeWorkspacesFromNodeRules` to exclude specific workspaces from being considered Node projects.
	 *
	 * Default is false.
	 */
	autoFindMonorepoPackages?: boolean

	/**
	 * When `autoFindMonorepoPackages` is true, this array of workspace names will be ignored form Node.JS specific rules.
	 *
	 * These should be relative paths from the root of the monorepo. (npm workspace style)
	 *
	 * Example: ['packages/app-ui', 'apps/client'] // projects that should not have Node.JS rules applied
	 */
	excludeWorkspacesFromNodeRules?: string[]

	/**
	 * Root directory of the monorepo. Required if `autoFindMonorepoPackages` is true.
	 */
	rootDir?: string
}

export type CustomizeFn = (options?: CustomizeOptions) => ConfigArray
