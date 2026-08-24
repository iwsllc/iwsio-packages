/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { defaults, defaultsDeep } from './defaults.js'

describe('defaults', () => {
	test('basic flat object', () => {
		const result = defaults({}, { one: 1, two: 2, three: 'three' })
		expect(result).to.deep.eq({ one: 1, two: 2, three: 'three' })
	})

	test('deep object (value exists), shallow defaults', () => {
		const four = { four: 4 }
		const result = defaults({ four }, { one: 1, two: 2, three: 'three', four: { four: 4, five: 5 } })
		expect(result).to.deep.eq({
			one: 1,
			two: 2,
			three: 'three',
			four: { four: 4 }
		})
		expect(result.four).to.equal(four) // strict equal by ref
		expect((result.four as any).five).to.not.be.ok
	})

	test('deep object (value null), shallow defaults', () => {
		const four = { four: 4, five: 5 }
		const result = defaults({}, { one: 1, two: 2, three: 'three', four })
		expect(result).to.deep.eq({
			one: 1,
			two: 2,
			three: 'three',
			four: { four: 4, five: 5 }
		})
		expect(result.four).to.equal(four) // strict equal by ref
		// type narrowing.
		if (!(result.four != null && typeof result.four === 'object' && 'five' in result.four))
			throw new Error('type guard failed')
		expect(result.four.five).to.be.ok
	})
})

describe('defaultsDeep', () => {
	test('basic flat object', () => {
		const result = defaultsDeep({}, { one: 1, two: 2, three: 'three' })
		expect(result).to.deep.eq({ one: 1, two: 2, three: 'three' })
	})

	test('deep object (value exists), deep defaults', () => {
		const four = { four: 4 }
		const result = defaultsDeep({ four }, { one: 1, two: 2, three: 'three', four: { four: 4, five: 5 } })
		expect(result).to.eql({
			one: 1,
			two: 2,
			three: 'three',
			four: { four: 4, five: 5 }
		})
		expect(result.four).to.equal(four) // strict equal by ref; but we're adding prop five to it.
		// type narrowing.
		if (!(result.four != null && typeof result.four === 'object' && 'five' in result.four))
			throw new Error('type guard failed')
		expect(result.four.five).to.be.ok // should bring in five.
	})

	test('deep object (value exists, but is not an obj), uses original value', () => {
		const four = 4
		const result = defaultsDeep({ four }, { one: 1, two: 2, three: 'three', four: { four: 4, five: 5 } })
		expect(result).to.eql({ one: 1, two: 2, three: 'three', four: 4 })
		expect(result.four).to.equal(four) // strict equal by ref; but we're adding prop five to it.

		expect((result.four as any).five).not.to.be.ok // should bring in five.
	})

	test('deep object (value null), deep defaults', () => {
		const four = { four: 4, five: 5 }
		const result = defaultsDeep({}, { one: 1, two: 2, three: 'three', four })
		expect(result).to.deep.equal({
			one: 1,
			two: 2,
			three: 'three',
			four: { four: 4, five: 5 }
		})
		expect(result.four).to.not.equal(four) // strict NON equal by ref

		// type narrowing.
		if (!(result.four != null && typeof result.four === 'object' && 'five' in result.four))
			throw new Error('type guard failed')
		expect(result.four.five).to.be.ok
	})

	test('deep object (value null), deep defaults, mismatching types', () => {
		const four = { four: 4, five: 5 }
		const result = defaultsDeep({ four: 4 }, { one: 1, two: 2, three: 'three', four })
		expect(result).to.deep.equal({ one: 1, two: 2, three: 'three', four: 4 })
		expect(result.four).to.not.equal(four) // strict NON equal by ref
		expect((result.four as any).five).to.not.be.ok
	})

	test('deep object (value null), deep defaults, mismatching types', () => {
		const result = defaultsDeep({ a: 1, d: { f: 1 } }, { b: 2 }, { b: 3, c: 4 }, { d: { e: 5, f: 2 } })
		expect(result).to.deep.equal({ a: 1, b: 2, c: 4, d: { e: 5, f: 1 } })
	})
})

describe('defaultsDeep with non-plain objects', () => {
	// Regression: a Blob/File body was deep-copied into a plain {} — Object.keys sees none
	// of its internal slots — so it reached fetch() as "[object Object]" with a 15-byte
	// Content-Length instead of the file. Non-plain objects must pass through by reference.
	test('passes a Blob body through by reference', () => {
		const blob = new Blob(['<svg></svg>'], { type: 'image/svg+xml' })
		const result = defaultsDeep({}, { body: blob }, { method: 'POST' })

		expect(result.body).to.equal(blob)
		expect(result.body).to.be.instanceOf(Blob)
	})

	test('passes FormData, URLSearchParams and Map through by reference', () => {
		const formData = new FormData()
		const params = new URLSearchParams({ a: '1' })
		const map = new Map([['a', 1]])
		const result = defaultsDeep({}, { formData, params, map })

		expect(result.formData).to.equal(formData)
		expect(result.params).to.equal(params)
		expect(result.map).to.equal(map)
	})

	test('still merges plain and null-prototype records', () => {
		const bare = Object.assign(Object.create(null), { b: 2 })
		const result = defaultsDeep({ headers: { a: 1 } }, { headers: { a: 9, c: 3 } }, { bare })

		expect(result.headers).to.deep.eq({ a: 1, c: 3 })
		expect(result.bare).to.deep.eq({ b: 2 })
		expect(result.bare).to.not.equal(bare) // copied, not shared
	})
})
