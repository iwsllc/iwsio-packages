import { getSerializedValue, parse, stringify } from './queryString.js'

describe('query-string', () => {
	describe('stringify', () => {
		test('When serializing simple object', () => {
			const v = encodeURIComponent('&#? ')
			const result = stringify({ key1: 'value1', key2: 'value2', key3: 3, key4: true, key5: '&#? ', key6: { something: 'unsupported' } })
			expect(result).to.eq('?key1=value1&key2=value2&key3=3&key4=true&key5=' + v)
		})
		test('When serializing object with array of values', () => {
			const v = encodeURIComponent('&#? ')
			const result = stringify({ key1: ['value1', 'value1-2'], key2: 'value2', key3: 3, key4: true, key5: '&#? ' })
			expect(result).to.eq('?key1=value1&key1=value1-2&key2=value2&key3=3&key4=true&key5=' + v)
		})
		test('When serializing undefined props', () => {
			expect(stringify({ page: 2 })).to.eql('?page=2')
			expect(stringify({ pageSize: 3 })).to.eql('?pageSize=3')
			expect(stringify({ page: 2, pageSize: 3 })).to.eql('?page=2&pageSize=3')
		})
		test('When serializing arrays of arrays: i.e. sort values', () => {
			const result = stringify({ sort: [['name', 1], ['age', -1]] })
			expect(result).to.eq('?sort=name%2C1&sort=age%2C-1')
		})
	})

	describe('parse', () => {
		test('When parsing qs', () => {
			const result = parse('key1=value1&key1=value1-2&key2=value2&key3=3&key4=true&key5=%26%23%3F%20')
			expect(result).to.deep.eq({ key1: ['value1', 'value1-2'], key2: 'value2', key3: '3', key4: 'true', key5: '&#? ' })
		})
		test('When parsing qs dup keys', () => {
			const result = parse('key1=value1&key1=value1-2&key2=value2&key3=3&key4=true&key5=%26%23%3F%20')
			expect(result).to.deep.eq({ key1: ['value1', 'value1-2'], key2: 'value2', key3: '3', key4: 'true', key5: '&#? ' })
		})
		test('parsing array of arrays', () => {
			const value = [['name', '1'], ['age', '-1']]
			const qs = stringify({ sort: value })
			expect(qs).to.eq('?sort=name%2C1&sort=age%2C-1')
			const parsed = parse(qs)

			// I'm good with this... we can't make assumptions on content of the value... so this is an expect result that parses one level down
			expect(parsed).to.deep.eq({ sort: ['name,1', 'age,-1'] }
			)
		})
	})

	describe('getSerializedValue', () => {
		it('should serialize arrays of values', () => {
			let result = getSerializedValue([1, 2, 3, 4])
			expect(result).toEqual('1,2,3,4')
			result = getSerializedValue(['test', null, 'somet,something', true, { something: 'unsupported' }, 4])
			// NOTE: ignores object and null
			expect(result).toEqual('test,somet%2Csomething,true,4')
		})

		it('should serialize string', () => {
			const result = getSerializedValue('hello &? ')
			expect(result).toEqual(encodeURIComponent('hello &? '))
		})

		it('should serialize number', () => {
			const result = getSerializedValue(42)
			expect(result).toEqual(encodeURIComponent('42'))
		})

		it('should serialize boolean', () => {
			const result = getSerializedValue(true)
			expect(result).toEqual(encodeURIComponent('true'))
		})

		it('should serialize Date', () => {
			const d = new Date('2020-01-01T00:00:00.000Z')
			const result = getSerializedValue(d)
			expect(result).toEqual(encodeURIComponent(d.toISOString()))
		})
	})
})
