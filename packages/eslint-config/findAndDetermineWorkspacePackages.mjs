import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

import fg from 'fast-glob'
import YAML from 'yaml'

function findPnpmWorkspaceConfig(rootDir) {
	const entries = readdirSync(rootDir, { withFileTypes: true })
	const found = entries.filter((e) => e.isFile() && /^pnpm-workspace\.(yml|yaml)$/iu.test(e.name)).map((e) => e.name)
	if (found.length > 1) throw new Error('Multiple pnpm-workspaces files found')
	if (found.length === 0) return undefined
	return found[0]
}

/**
 * Find workspace packages in a monorepo using either pnpm-workspace.yaml or package.json workspaces field
 *
 * Supports both pnpm and npm workspaces
 *
 * @param {string} rootDir Provide the root directory of the monorepo
 * @param {object} [options] Options
 * @param {boolean} [options.debug=false] Enable debug logging
 * @returns {string[]} Array of workspace package names
 *
 * @example
 * ```js
 * import { fileURLToPath } from 'node:url'
 * const __dirname = fileURLToPath(new URL('.', import.meta.url))
 *
 * const workspacePackages = await findAndDetermineWorkspacePackages(__dirname)
 * console.log(workspacePackages)
 * ```
 */
export async function findAndDetermineWorkspacePackages(rootDir, options = {}) {
	const { debug = false } = options
	const packageJsonPath = join(rootDir, 'package.json')
	const pnpmConfigFile = findPnpmWorkspaceConfig(rootDir)
	const pnpmWorkspacePath = pnpmConfigFile != null ? join(rootDir, pnpmConfigFile) : undefined

	// /** @type {string[] | undefined} */
	// eslint-disable-next-line no-useless-assignment -- I think it's blind
	let relativePackagePatterns

	if (pnpmWorkspacePath != null) {
		// read pattern from the pnpm-workspace.yaml
		const yaml = readFileSync(pnpmWorkspacePath, 'utf8')
		const parsed = YAML.parse(yaml)
		relativePackagePatterns = parsed.packages ?? []
		if (debug) console.log('read from pnpm-workspaces.yaml workspaces')
	} else {
		// check for workspace pattern in package.json
		const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
		relativePackagePatterns = packageJson.workspaces ?? []
		if (debug) console.log('read from package.json workspaces')
	}

	const pattern = relativePackagePatterns.map((p) => join(rootDir, p, 'package.json'))

	const workspacePackageNames = []
	for await (const entry of fg.stream(pattern, { concurrency: 4 })) {
		// entry is a string path or an object with dirent info if `objectMode: true`
		const content = readFileSync(entry, 'utf8')
		const pkg = JSON.parse(content)
		workspacePackageNames.push({ name: pkg.name, dir: dirname(entry) })
	}

	if (debug) console.log('Determined workspace packages:', workspacePackageNames)

	return workspacePackageNames
}
