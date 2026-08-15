import { defaultFetchOptions } from './defaultFetchOptions.js'

describe('defaultFetchOptions', () => {
	it('applies the defaults when nothing is supplied', () => {
		expect(defaultFetchOptions()).toEqual({
			method: 'GET',
			headers: { 'Content-type': 'application/json' }
		})
	})

	it('lets a caller override the method', () => {
		expect(defaultFetchOptions({ method: 'PATCH' }).method).to.eq('PATCH')
	})

	it('merges headers rather than replacing them', () => {
		const result = defaultFetchOptions({ headers: { Authorization: 'Bearer x' } })
		expect(result.headers).toEqual({
			Authorization: 'Bearer x',
			'Content-type': 'application/json'
		})
	})

	// The body is caller data, not options: running it through the defaults merge dropped every
	// null-valued property, so an API's "clear this field" arrived as an absent key instead.
	it('keeps null properties in the json body', () => {
		const result = defaultFetchOptions({ method: 'PATCH', json: { name: 'Consulting', description: null } })

		expect(result.json).toEqual({ name: 'Consulting', description: null })
		expect(result.json).toHaveProperty('description')
	})

	it('keeps nulls nested inside the json body', () => {
		const result = defaultFetchOptions({ json: { billing: { line1: '1 Main St', line2: null } } })

		expect(result.json).toEqual({ billing: { line1: '1 Main St', line2: null } })
	})

	it('keeps a null inside an array in the json body', () => {
		const result = defaultFetchOptions({ json: { lines: [{ itemId: null }] } })

		expect(result.json).toEqual({ lines: [{ itemId: null }] })
	})

	// the body must reach fetch as the caller built it, not a reconstructed copy
	it('passes the json body through by reference', () => {
		const json = { description: null }
		expect(defaultFetchOptions({ json }).json).to.eq(json)
	})

	it('takes the json from the first source that carries one', () => {
		const result = defaultFetchOptions({ json: { a: 1 } }, { json: { b: 2 } })
		expect(result.json).toEqual({ a: 1 })
	})

	it('still merges the other options on a source that also carries json', () => {
		const result = defaultFetchOptions({ method: 'POST', json: { a: null } }, { credentials: 'include' })

		expect(result.method).to.eq('POST')
		expect(result.credentials).to.eq('include')
		expect(result.json).toEqual({ a: null })
	})

	it('leaves json absent when no source supplies one', () => {
		expect(defaultFetchOptions({ method: 'GET' })).not.toHaveProperty('json')
	})
})
