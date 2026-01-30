import { FetchError } from './FetchError.js'
import { isFetchError } from './isFetchError.js'
import { resolveResponse } from './resolveResponse.js'

describe('resolveResponse', () => {
	it('should resolve response', async () => {
		const res = new Response('{"foo": "bar"}', { status: 200 })
		const result = await resolveResponse<{ foo: string }>(res)
		expect(result).toEqual({ foo: 'bar' })
	})

	it('should resolve response with empty body', async () => {
		const res = new Response('', { status: 200 })
		const result = await resolveResponse<{ foo: string }>(res)
		expect(result).toEqual(null)
	})

	it('should resolve response with text body', async () => {
		const res = new Response('This is a test', { status: 200 })
		const result = await resolveResponse<{ foo: string }>(res, { resolveWithResponseBody: true })
		expect(result).toEqual('This is a test')
	})

	it('should reject response', async () => {
		const res = new Response('{"message": "error"}', { status: 400 })
		try {
			await resolveResponse<{ foo: string }, { error?: string, stack?: string }>(res)
		} catch (err) {
			expect(err).toBeInstanceOf(FetchError)
			if (!isFetchError(err)) throw new Error('Invalid error')
			expect(err.body).toEqual({ message: 'error' })
			expect(err.message).to.eql('Request failed')
		}
	})
	it('should reject text response', async () => {
		const res = new Response('Not found', { status: 404 })
		try {
			await resolveResponse<{ foo: string }>(res)
		} catch (err) {
			expect(err).toBeInstanceOf(FetchError)
			if (!isFetchError(err)) return
			expect(err.body).toEqual('Not found')
			expect(err.message).to.eql('Request failed')
		}
	})
})
