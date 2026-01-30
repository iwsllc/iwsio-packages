/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { FetchError, setupFetch } from './index.js'

globalThis.fetch = vi.fn() as any

describe('Index', () => {
	describe('setupFetch', () => {
		describe('getOne', () => {
			it('getOne with response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(JSON.stringify({ something: 'anything' })) } as any)
				const { getOne } = setupFetch('http://localhost:3000')
				const result = await getOne<{ something: string }>('/api/v1/users', '5')
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users/5', {
					method: 'GET',
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual({ something: 'anything' })
			})
			it('getOne with general exception', async () => {
				vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Failed to fetch'))
				const { getOne } = setupFetch<{ error?: string, stack?: string }>('http://localhost:3000')
				try {
					await getOne('/api/v1/users', '5')
				} catch (err) {
					if (!(err instanceof Error)) throw new Error('Expected Error')
					expect(err.message).toEqual('Failed to fetch')
				}
			})
			const isErrorBody = (data: unknown): data is { error: string, stack: string } => {
				return data != null && typeof data === 'object' && 'error' in data && 'stack' in data
			}
			it('getOne with http non-success', async () => {
				vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: false, status: 404, text: () => Promise.resolve(JSON.stringify({ error: 'not found', stack: 'stack' })) } as any)
				const { getOne } = setupFetch('http://localhost:3000')
				try {
					await getOne('/api/v1/users', '5')
				} catch (err) {
					expect(err).toBeInstanceOf(FetchError)
					if (!(err instanceof FetchError)) throw new Error('Expected FetchError')
					expect(err.isJson).toEqual(true)
					expect(err.message).toEqual('Request failed')
					if (!isErrorBody(err.body)) throw new Error('Expected body to be an object')
					expect(err.body.error).toEqual('not found')
					expect(err.body.stack).toEqual('stack')
				}
			})
			it('getOne with http non-success, text body', async () => {
				vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: false, status: 404, text: () => Promise.resolve('Not found') } as any)
				const { getOne } = setupFetch('http://localhost:3000')
				try {
					await getOne('/api/v1/users', '5')
				} catch (err) {
					expect(err).toBeInstanceOf(FetchError)
					if (!(err instanceof FetchError)) throw new Error('Expected FetchError')
					expect(err.isJson).toEqual(false)
					expect(err.message).toEqual('Request failed')
					expect(err.body).toEqual('Not found')
				}
			})
			it('getOne with response and query string params', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(JSON.stringify({ something: 'anything' })) } as any)
				const { getOne } = setupFetch('http://localhost:3000')
				const result = await getOne<{ something: string }>('/api/v1/users', '5', { query: { something: 'anything' } })
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users/5?something=anything', {
					method: 'GET',
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual({ something: 'anything' })
			})
		})
		describe('get', () => {
			it('get with response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(JSON.stringify({ something: 'anything' })) } as any)
				const { get } = setupFetch('http://localhost:3000')
				const result = await get<{ something: string }>('/api/v1/users')
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users', {
					method: 'GET',
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual({ something: 'anything' })
			})
			it('get with query string and response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(JSON.stringify({ something: 'anything' })) } as any)
				const { get } = setupFetch('http://localhost:3000')
				const result = await get<{ something: string }>('/api/v1/users', { query: { something: 'anything' } })
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users?something=anything', {
					method: 'GET',
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual({ something: 'anything' })
			})
		})
		describe('getMany', () => {
			it('getMany with response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(JSON.stringify([{ something: 'anything' }])) } as any)
				const { getMany } = setupFetch('http://localhost:3000')
				const result = await getMany<{ something: string }>('/api/v1/users')
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users', {
					method: 'GET',
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual([{ something: 'anything' }])
			})
		})
		describe('delOne', () => {
			it('delOne without request body and response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(null) } as any)
				const { delOne } = setupFetch('http://localhost:3000')
				const result = await delOne('/api/v1/users', '5')
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users/5', {
					method: 'DELETE',
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual(null)
			})
			it('delOne with request body and no response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(null) } as any)
				const { delOne } = setupFetch('http://localhost:3000')
				const result = await delOne<{ anything: string }>('/api/v1/users', '5', { anything: 'something' })
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users/5', {
					method: 'DELETE',
					body: JSON.stringify({ anything: 'something' }),
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual(null)
			})
			it('delOne with request body and response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(JSON.stringify({ something: 'anything' })) } as any)
				const { delOne } = setupFetch('http://localhost:3000')
				const result = await delOne<{ anything: string }, { something: string }>('/api/v1/users', '5', { anything: 'something' })
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users/5', {
					method: 'DELETE',
					body: JSON.stringify({ anything: 'something' }),
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual({ something: 'anything' })
			})
		})
		describe('del', () => {
			it('del without request body and response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(null) } as any)
				const { del } = setupFetch('http://localhost:3000')
				const result = await del('/api/v1/users')
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users', {
					method: 'DELETE',
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual(null)
			})
			it('del with request body and no response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(null) } as any)
				const { del } = setupFetch('http://localhost:3000')
				const result = await del<{ anything: string }>('/api/v1/users', { anything: 'something' })
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users', {
					method: 'DELETE',
					body: JSON.stringify({ anything: 'something' }),
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual(null)
			})
			it('del with request body and response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(JSON.stringify({ something: 'anything' })) } as any)
				const { del } = setupFetch('http://localhost:3000')
				const result = await del<{ anything: string }, { something: string }>('/api/v1/users', { anything: 'something' })
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users', {
					method: 'DELETE',
					body: JSON.stringify({ anything: 'something' }),
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual({ something: 'anything' })
			})
		})
		describe('post', () => {
			it('post without request body and response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(null) } as any)
				const { post } = setupFetch('http://localhost:3000')
				const result = await post('/api/v1/users')
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users', {
					method: 'POST',
					json: undefined,
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual(null)
			})
			it('post with request body and no response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(null) } as any)
				const { post } = setupFetch('http://localhost:3000')
				const result = await post<{ anything: string }>('/api/v1/users', { anything: 'something' })
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users', {
					method: 'POST',
					body: JSON.stringify({ anything: 'something' }),
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual(null)
			})
			it('post with request body and response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(JSON.stringify({ something: 'anything' })) } as any)
				const { post } = setupFetch('http://localhost:3000')
				const result = await post<{ anything: string }, { something: string }>('/api/v1/users', { anything: 'something' })
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users', {
					method: 'POST',
					body: JSON.stringify({ anything: 'something' }),
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual({ something: 'anything' })
			})
		})
		describe('postOne', () => {
			it('postOne without request body and response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(null) } as any)
				const { postOne } = setupFetch('http://localhost:3000')
				const result = await postOne('/api/v1/users', '5')
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users/5', {
					method: 'POST',
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual(null)
			})
			it('postOne with request body and no response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(null) } as any)
				const { postOne } = setupFetch('http://localhost:3000')
				const result = await postOne<{ anything: string }>('/api/v1/users', '5', { anything: 'something' })
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users/5', {
					method: 'POST',
					body: JSON.stringify({ anything: 'something' }),
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual(null)
			})
			it('postOne with request body and response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(JSON.stringify({ something: 'anything' })) } as any)
				const { postOne } = setupFetch('http://localhost:3000')
				const result = await postOne<{ anything: string }, { something: string }>('/api/v1/users', '5', { anything: 'something' })
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users/5', {
					method: 'POST',
					body: JSON.stringify({ anything: 'something' }),
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual({ something: 'anything' })
			})
		})
		describe('put', () => {
			it('put without request body and response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(null) } as any)
				const { put } = setupFetch('http://localhost:3000')
				const result = await put('/api/v1/users')
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users', {
					method: 'PUT',
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual(null)
			})
			it('put with request body and no response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(null) } as any)
				const { put } = setupFetch('http://localhost:3000')
				const result = await put<{ anything: string }>('/api/v1/users', { anything: 'something' })
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users', {
					method: 'PUT',
					body: JSON.stringify({ anything: 'something' }),
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual(null)
			})
			it('put with request body and response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(JSON.stringify({ something: 'anything' })) } as any)
				const { put } = setupFetch('http://localhost:3000')
				const result = await put<{ anything: string }, { something: string }>('/api/v1/users', { anything: 'something' })
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users', {
					method: 'PUT',
					body: JSON.stringify({ anything: 'something' }),
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual({ something: 'anything' })
			})
		})
		describe('putOne', () => {
			it('putOne without request body and response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(null) } as any)
				const { putOne } = setupFetch('http://localhost:3000')
				const result = await putOne('/api/v1/users', '5')
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users/5', {
					method: 'PUT',
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual(null)
			})
			it('putOne with request body and no response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(null) } as any)
				const { putOne } = setupFetch('http://localhost:3000')
				const result = await putOne<{ anything: string }>('/api/v1/users', '5', { anything: 'something' })
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users/5', {
					method: 'PUT',
					body: JSON.stringify({ anything: 'something' }),
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual(null)
			})
			it('putOne with request body and response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(JSON.stringify({ something: 'anything' })) } as any)
				const { putOne } = setupFetch('http://localhost:3000')
				const result = await putOne<{ anything: string }, { something: string }>('/api/v1/users', '5', { anything: 'something' })
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users/5', {
					method: 'PUT',
					body: JSON.stringify({ anything: 'something' }),
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual({ something: 'anything' })
			})
		})
		describe('patch', () => {
			it('patch without request body and response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(null) } as any)
				const { patch } = setupFetch('http://localhost:3000')
				const result = await patch('/api/v1/users')
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users', {
					method: 'PATCH',
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual(null)
			})
			it('patch with request body and no response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(null) } as any)
				const { patch } = setupFetch('http://localhost:3000')
				const result = await patch<{ anything: string }>('/api/v1/users', { anything: 'something' })
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users', {
					method: 'PATCH',
					body: JSON.stringify({ anything: 'something' }),
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual(null)
			})
			it('patch with request body and response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(JSON.stringify({ something: 'anything' })) } as any)
				const { patch } = setupFetch('http://localhost:3000')
				const result = await patch<{ anything: string }, { something: string }>('/api/v1/users', { anything: 'something' })
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users', {
					method: 'PATCH',
					body: JSON.stringify({ anything: 'something' }),
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual({ something: 'anything' })
			})
		})
		describe('patchOne', () => {
			it('patchOne without request body and response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(null) } as any)
				const { patchOne } = setupFetch('http://localhost:3000')
				const result = await patchOne('/api/v1/users', '5')
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users/5', {
					method: 'PATCH',
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual(null)
			})
			it('patchOne with request body and no response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(null) } as any)
				const { patchOne } = setupFetch('http://localhost:3000')
				const result = await patchOne<{ anything: string }>('/api/v1/users', '5', { anything: 'something' })
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users/5', {
					method: 'PATCH',
					body: JSON.stringify({ anything: 'something' }),
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual(null)
			})
			it('patchOne with request body and response', async () => {
				const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, status: 200, text: () => Promise.resolve(JSON.stringify({ something: 'anything' })) } as any)
				const { patchOne } = setupFetch('http://localhost:3000')
				const result = await patchOne<{ anything: string }, { something: string }>('/api/v1/users', '5', { anything: 'something' })
				expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/v1/users/5', {
					method: 'PATCH',
					body: JSON.stringify({ anything: 'something' }),
					headers: {
						'Content-type': 'application/json'
					}
				})
				expect(result).toEqual({ something: 'anything' })
			})
		})
	})
})
