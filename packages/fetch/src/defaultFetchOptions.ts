import { defaultsDeep } from './defaults.js'
import type { FetchArgs, FetchOptions } from './types.js'

export function defaultFetchOptions(...overrides: FetchArgs[]): FetchOptions & RequestInit {
	const defaultArgs = {
		method: 'GET',
		headers: {
			'Content-type': 'application/json'
		}
	}
	return defaultsDeep({}, ...overrides, defaultArgs) // note: overrides first, defaults second; only assigns in when undefined (left to right)
}
