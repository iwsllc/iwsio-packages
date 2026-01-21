export interface ResolveResponseOptions {
	/**
	 * If true, the response body as text will be returned as-is (asserted as T), without attempting to parse it as JSON.
	 */
	resolveWithResponseBody?: boolean
}

export interface FetchOptions extends Record<string, unknown>, ResolveResponseOptions {
	json?: unknown
	query?: Record<string, unknown> // query string parameters; allow anything and we'll serialize it internally
}

export type FetchArgs = FetchOptions & Partial<RequestInit>

export interface FetchResponse<T, E> extends Omit<Response, 'json'> {
	json: () => Promise<T | E | undefined>
}

export interface FetchEmptyResponse<E> extends Omit<Response, 'json'> {
	json: () => Promise<E | undefined>
}

export interface IdBody { id: string }

export type WithId<T> = Omit<T, 'id'> & IdBody

export interface AffectedBody { count: number }

export type DataBody<T> = Omit<Partial<T>, 'id'>
