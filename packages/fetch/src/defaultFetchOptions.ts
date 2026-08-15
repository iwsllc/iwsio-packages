import { defaultsDeep } from './defaults.js'
import type { FetchArgs, FetchOptions } from './types.js'

/**
 * Merge caller options over the library defaults.
 *
 * `json` is deliberately held out of the merge and reattached afterwards. It is the caller's
 * request payload, not a set of options, and `defaultsDeep` only copies a key whose value is
 * `!= null` — so recursing into a body would silently DROP every null-valued property on the
 * way to the server. A field explicitly set to null is how an API says "clear this", and it
 * would arrive as an absent key, indistinguishable from "leave it alone".
 *
 * The first source that carries `json` wins, matching the left-to-right precedence the rest
 * of the merge uses.
 */
export function defaultFetchOptions(...overrides: FetchArgs[]): FetchOptions & RequestInit {
	const defaultArgs = {
		method: 'GET',
		headers: {
			'Content-type': 'application/json'
		}
	}

	const withJson = overrides.find((override) => override != null && 'json' in override)
	const optionsOnly = overrides.map((override) => {
		if (override == null || !('json' in override)) return override
		const { json: _json, ...rest } = override
		return rest as FetchArgs
	})

	const merged = defaultsDeep({}, ...optionsOnly, defaultArgs) as FetchOptions & RequestInit
	// reattached by reference: the body is serialized verbatim, nulls and all
	if (withJson != null) merged.json = withJson.json

	return merged
}
