import { fileURLToPath } from 'node:url'

import { configure } from '@iwsio/eslint-config'
const __dirname = fileURLToPath(new URL('.', import.meta.url))

const excludeWorkspacesFromNodeRules = ['packages/fetch', 'packages/tsconfig'] // meant for browser only or not Node related.

const configs = await configure({ includeTypeChecked: true, autoFindMonorepoPackages: true, rootDir: __dirname, excludeWorkspacesFromNodeRules })
export default configs
