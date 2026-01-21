import { defaultFetchOptions } from './defaultFetchOptions.js'
import { stringify } from './queryString.js'
import { FetchArgs, FetchResponse } from './types.js'

export const fetchTyped = async <T = unknown, E = unknown>(url: string, ...options: FetchArgs[]): Promise<FetchResponse<T, E>> => {
	const args = defaultFetchOptions(...options)
	if (args.json != null) {
		args.body = JSON.stringify(args.json)
		delete args.json
	}

	if (typeof args.query === 'object') {
		if (url.indexOf('?') >= 0) throw new Error('Cannot fetch with both query options and a url that contains a \'?\'. Please solely use options.query.')
		const query = stringify(args.query)
		url += query
		delete args.query
	}
	const res = await fetch(url, args) // throws on network errors and 500 responses
	return res satisfies FetchResponse<T, E>
}
