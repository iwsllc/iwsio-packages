import * as qs from './queryString.js'

describe('query-string', () => {
	test('When serializing simple object', () => {
		const v = encodeURIComponent('&#? ')
		const result = qs.stringify({ key1: 'value1', key2: 'value2', key3: 3, key4: true, key5: '&#? ', key6: { something: 'unsupported'} })
		expect(result).to.eq('?key1=value1&key2=value2&key3=3&key4=true&key5=' + v)
	})
	test('When serializing object with array of values', () => {
		const v = encodeURIComponent('&#? ')
		const result = qs.stringify({ key1: ['value1', 'value1-2'], key2: 'value2', key3: 3, key4: true, key5: '&#? ' })
		expect(result).to.eq('?key1=value1&key1=value1-2&key2=value2&key3=3&key4=true&key5=' + v)
	})
	test('When parsing qs', () => {
		const result = qs.parse('key1=value1&key1=value1-2&key2=value2&key3=3&key4=true&key5=%26%23%3F%20')
		expect(result).to.deep.eq({ key1: ['value1', 'value1-2'], key2: 'value2', key3: '3', key4: 'true', key5: '&#? ' })
	})
	test('When parsing qs dup keys', () => {
		const result = qs.parse('key1=value1&key1=value1-2&key2=value2&key3=3&key4=true&key5=%26%23%3F%20')
		expect(result).to.deep.eq({ key1: ['value1', 'value1-2'], key2: 'value2', key3: '3', key4: 'true', key5: '&#? ' })
	})
	test('When serializing undefined props', () => {
		expect(qs.stringify({ page: 2 })).to.eql('?page=2')
		expect(qs.stringify({ pageSize: 3 })).to.eql('?pageSize=3')
		expect(qs.stringify({ page: 2, pageSize: 3 })).to.eql('?page=2&pageSize=3')
	})
})
