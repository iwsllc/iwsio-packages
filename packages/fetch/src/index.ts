import { fetchTyped } from './fetchTyped.js'
import { resolveResponse } from './resolveResponse.js'
import type { FetchArgs } from './types.js'

export * from './FetchError.js'
export * from './isFetchError.js'
export * from './types.js'

export { fetchTyped, resolveResponse }
/**
 * Setup shared utility functions with a common pattern for Error typing. Use this per unique
 * type of query you want to make. i.e. public unauthenticated queries or authenticated in-app
 * queries. These can be placed in a module and shared like the example below. Consumers of these
 * functions will use relative paths as urls.
 *
 * i.e.
 * ```
 * const utils = setupFetch<PlainError>('http://localhost:3000')
 * export const { getMany, getOne, post, patch } = utils
 * const users: User[] = await getMany<User>('/users')
 * ```
 * @param baseUrl Base URL (excluding trailing slash) for all api calls with these functions;
 * Defaults to blank string. This means than fetches will use the endpoint as the absolute URL. `/api/test` will fetch verbatim.
 * @param defaultOptions Default request options. See MDN RequestInit/fetch
 * @returns
 */
export function setupFetch<E = unknown>(baseUrl: string = '', defaultOptions: Partial<RequestInit> = {}) {
	async function fetchWithDefaultOptions<T, E>(endpoint: string, options: FetchArgs = {}) {
		return await fetchTyped<T, E>(`${baseUrl}${endpoint}`, options, defaultOptions)
	}

	async function getOne<Response = unknown>(
		endpoint: string,
		id: string | undefined = undefined,
		options: FetchArgs = {}
	) {
		const resolvedEndpoint = id == null ? endpoint : `${endpoint}/${encodeURIComponent(id)}`
		const res = await fetchWithDefaultOptions<Response, E>(resolvedEndpoint, options)
		return resolveResponse(res, options)
	}

	async function get<Response = unknown>(endpoint: string, options: FetchArgs = {}) {
		const res = await fetchWithDefaultOptions<Response, E>(endpoint, options)
		return resolveResponse(res, options)
	}

	async function getMany<Response = unknown>(endpoint: string, options: FetchArgs = {}) {
		const res = await fetchWithDefaultOptions<Response[], E>(endpoint, options)
		return resolveResponse(res, options)
	}

	async function send<Request = unknown, Response = unknown>(
		endpoint: string,
		method: string,
		data?: Request,
		options: FetchArgs = {}
	) {
		const res = await fetchWithDefaultOptions<Response, E>(endpoint, {
			...options,
			method,
			json: data
		})
		return resolveResponse(res, options)
	}

	async function sendOne<Request = unknown, Response = unknown>(
		endpoint: string,
		method: string,
		id: string,
		data?: Request,
		options: FetchArgs = {}
	) {
		if (id == null) throw new Error('Cannot update without id.')
		const res = await fetchWithDefaultOptions<Response, E>(`${endpoint}/${encodeURIComponent(id)}`, {
			...options,
			method,
			json: data
		})
		return resolveResponse(res, options)
	}

	async function post<Request = unknown, Response = unknown>(
		endpoint: string,
		data?: Request,
		options: FetchArgs = {}
	) {
		return await send<Request, Response>(endpoint, 'POST', data, options)
	}

	async function postOne<Request = unknown, Response = unknown>(
		endpoint: string,
		id: string,
		data?: Request,
		options: FetchArgs = {}
	) {
		return await sendOne<Request, Response>(endpoint, 'POST', id, data, options)
	}

	async function put<Request = unknown, Response = unknown>(endpoint: string, data?: Request, options: FetchArgs = {}) {
		return await send<Request, Response>(endpoint, 'PUT', data, options)
	}

	async function putOne<Request = unknown, Response = unknown>(
		endpoint: string,
		id: string,
		data?: Request,
		options: FetchArgs = {}
	) {
		return await sendOne<Request, Response>(endpoint, 'PUT', id, data, options)
	}

	async function patch<Request = unknown, Response = unknown>(
		endpoint: string,
		data?: Request,
		options: FetchArgs = {}
	) {
		return await send<Request, Response>(endpoint, 'PATCH', data, options)
	}

	async function patchOne<Request = unknown, Response = unknown>(
		endpoint: string,
		id: string,
		data?: Request,
		options: FetchArgs = {}
	) {
		return await sendOne<Request, Response>(endpoint, 'PATCH', id, data, options)
	}

	async function del<Request = unknown, Response = unknown>(endpoint: string, data?: Request, options: FetchArgs = {}) {
		return await send<Request, Response>(endpoint, 'DELETE', data, options)
	}

	async function delOne<Request = unknown, Response = unknown>(
		endpoint: string,
		id: string,
		data?: Request,
		options: FetchArgs = {}
	) {
		return await sendOne<Request, Response>(endpoint, 'DELETE', id, data, options)
	}

	return {
		fetch: fetchWithDefaultOptions,
		del,
		delOne,
		getMany,
		getOne,
		get,
		patch,
		patchOne,
		post,
		postOne,
		put,
		putOne
	}
}
