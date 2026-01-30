/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { fetchTyped } from './fetchTyped.js'

const host = 'http://localhost:3000'

interface Thing { data: string }
interface ErrorBody { message: string, stack?: string }
interface Movie {
	title: string
	year: number
	director: string
	cast: string[]
	genres: string[]
	rating: number
}
type Movies = Movie[]

// very simple type assertions
const isMovie = (data: unknown): data is Movie => data != null && typeof data === 'object' && 'title' in data
const isError = (data: unknown): data is ErrorBody => data != null && typeof data === 'object' && 'message' in data

describe('fetchTyped', () => {
	beforeEach(() => {
		vi.spyOn(window, 'fetch')
	})
	it('should fetch with typed response on success', async () => {
		vi.spyOn(window, 'fetch').mockReturnValue(Promise.resolve({ json: () => Promise.resolve({ data: 'test2' }) } as any))

		const response = await fetchTyped<Thing, ErrorBody>('https://example.com/movies.json')
		const result = await response.json() as Thing
		expect(result.data).to.eq('test2')
	})

	it('should fetch with typed response on success with query string parameters', async () => {
		const spyFetch = vi.spyOn(window, 'fetch').mockReturnValue(Promise.resolve({ json: () => Promise.resolve({ data: 'test2' }) } as any))

		const response = await fetchTyped<Thing, ErrorBody>('https://example.com/movies.json', { query: { pageIx: '0', pageSize: '20' } })
		const result = await response.json() as Thing

		expect(result.data).to.eq('test2')
		expect(spyFetch).toHaveBeenCalledWith('https://example.com/movies.json?pageIx=0&pageSize=20', { method: 'GET', headers: { 'Content-type': 'application/json' } })
	})

	it('should fetch with empty response on success', async () => {
		vi.spyOn(window, 'fetch').mockReturnValue(Promise.resolve({ json: () => Promise.resolve(null) } as any))

		const response = await fetchTyped('https://example.com/movies.json')
		const result = await response.json()
		expect(result).to.eq(null)
	})

	it('should return typed Error when fail', async () => {
		vi.spyOn(window, 'fetch').mockReturnValue(Promise.resolve({ ok: false, json: () => Promise.resolve({ message: 'error', stack: 'stack' }) } as any))

		const response = await fetchTyped<Thing, ErrorBody>('https://example.com/movies.json')
		let result: Thing | null = null
		let error: ErrorBody | null = null
		if (response.ok) result = await response.json() as Thing
		else error = await response.json() as ErrorBody

		expect(error).to.be.ok
		if (error == null) return

		expect(error.message).to.eq('error')
		expect(error.stack).to.eq('stack')
		expect(result).not.to.be.ok
	})

	it('should work with query options')
	it('should work with json body')
	it('should work with RequestInit overrides')

	describe.skip('Integration tests', () => {
		const expectedData: Movie = {
			title: 'The Matrix',
			year: 1999,
			director: 'The Wachowski Brothers',
			cast: [
				'Keanu Reeves',
				'Laurence Fishburne',
				'Carrie-Anne Moss',
				'Hugo Weaving'
			],
			genres: [
				'Action',
				'Sci-Fi'
			],
			rating: 8.7
		}
		beforeEach(() => {
			vi.restoreAllMocks()
		})

		it('should fetch with typed response on success', async () => {
			const response = await fetchTyped<Movies, ErrorBody>(`${host}/test-json`)
			expect(response.ok).to.be.true
			expect(response.status).to.eq(200)

			const result = await response.json()

			expect(result).to.be.ok
			if (result == null) return

			// data assertion
			expect(result).to.deep.eq([expectedData])

			if (isError(result)) return // type check
			expect(isMovie(result[0])).to.be.true
		})

		it('should fetch with failed text response on non-http success', async () => {
			const response = await fetchTyped(`${host}/test-500-json`)
			expect(response.ok).to.be.false
			expect(response.status).to.eq(500)

			const result = await response.json()

			expect(result).to.be.ok
			if (result == null) return

			// data assertion
			expect(result).to.deep.eq({ message: 'Fake error', stack: 'Fake stack trace' })

			expect(isError(result)).to.be.true
		})
	})
})
