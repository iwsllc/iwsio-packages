import reactRefresh from 'eslint-plugin-react-refresh'

/** @type { import('@typescript-eslint/utils/ts-eslint').FlatConfig.Rules } */
const reactRefreshRules = {
	'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
}

/** @type {import('@typescript-eslint/utils/ts-eslint').FlatConfig.Config} */
const reactRefreshConfig = {
	plugins: Object.freeze({
		'react-refresh': reactRefresh
	}),
	rules: Object.freeze(reactRefreshRules)
}

export default Object.freeze(reactRefreshConfig)
