# @iwsio/fetch

[![@iwsio/fetch: Push to main](https://github.com/iwsllc/iwsio-packages/actions/workflows/fetch-push-main.yaml/badge.svg)](https://github.com/iwsllc/iwsio-packages/actions/workflows/fetch-push-main.yaml)

This package is meant to simplify fetching and resolving typed values from an API using the [built-in `fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

```tsx
import { setupFetch } from '@iwsio/fetch'

// example error response body
interface DefaultErrorBody {
	message: string
	stack?: string
}

// example body
interface User {
	name: string,
	email: string,
	phone: string,
	created: string // ISO, etc
}

interface UserListResponse {
	size: number,
	pageIx: number,
	data: User[],
	total: number
}

// setup fetch functions
const utils = setupFetch<DefaultErrorBody>('http://localhost:3000', {/*...default request options*/})

// No baseUrl, default options
const utils = setupFetch<DefaultErrorBody>()

// No base url and specifying default options
const utils = setupFetch<DefaultErrorBody>('', {/*... default request options*/}) // No baseUrl

export const { get, getMany, getOne, post, patch, /* ...more */ } = utils

// Consuming
try {
	const user = await getOne<User>('/users', id)

	// OR manually
	const user2 = await get<User>('/users/123')

	// Simple get many; assume response is simple array of type
	const users = await getMany<User>('/users')

	// More complex get many... response might be paged, with meta info
	const listResponse = await get<UserListResponse>('/users?page=2&size=20')

} catch(err: unknown) {
	if (isFetchError(err)) {
		// ...; work with err.body; and `isErrorBody` type assertion
	}
}
```

## React Query

Here are a few ways you can use the above typed fetch with React Query.

```ts
export const useGet = <Response>(endpoint: string, options?: unknown): UseQueryResult<Response, FetchError<ErrorResponse>> => {
	return useQuery({ queryKey: [endpoint], queryFn: () => getOne<Response>(endpoint), ...options })
}

export const usePagedGet = <Response>(endpoint: string, page: number = 0, pageSize: number = 20, options?: unknown): UseQueryResult<Response, FetchError<ErrorResponse>> => {
	return useQuery({ queryKey: [endpoint, { page, pageSize }], queryFn: () => get<Response>(endpoint, { query: { pageIx: page.toString(), pageSize: pageSize.toString() } }), placeholderData: keepPreviousData, ...options })
}

export const usePost = <Request = unknown, Response = unknown>(endpoint: string, options?: any): UseMutationResult<Response, FetchError<ErrorResponse>, Request, unknown> => {
	return useMutation<Response, FetchError<ErrorResponse>, Request, unknown>({
		mutationFn: data => post<Request, Response>(endpoint, data), ...options
	})
}

export const useDeleteOne = <Response = unknown>(endpoint: string, options?: any): UseMutationResult<Response, FetchError<ErrorResponse>, unknown, unknown> => {
	return useMutation<Response, FetchError<ErrorResponse>, unknown, unknown>({
		mutationFn: (id: string) => del<Response>(`${endpoint}/${id}`), ...options
	})
}

// consuming these RQ hooks
const {data, isSuccess} = useGet<Thing>('/api/things/123') // GET /api/things/123

const {data, isSuccess} = useGetOne<Thing>('/api/things', '123') // GET /api/things/123

const { data, mutate, isSuccess, isError, error } = usePost<ThingRequest, ThingResponse>('/api/things')
mutate({ ...thingRequest }) // DELETE /api/things/123
// consume `data` as `ThingResponse` or `error` as `FetchError<ErrorResponse>`

const { mutate, isSuccess, isError } = useDeleteOne<void>('/api/things')
mutate('123') // DELETE /api/things/123
```
