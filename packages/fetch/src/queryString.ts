const isString = (value: unknown): value is string => typeof value === 'string'
const isNumber = (value: unknown): value is number => typeof value === 'number' && !isNaN(value)
const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'
const isDate = (value: unknown): value is Date => value instanceof Date

function getPrimitiveValue(value: unknown): string | undefined {
	let rawValue: string | undefined
	if (isString(value)) rawValue = value
	else if (isNumber(value) || isBoolean(value)) rawValue = value.toString()
	else if (isDate(value)) rawValue = value.toISOString()
	else {
		return undefined // unsupported type
	}

	if (rawValue == null) return undefined
	return encodeURIComponent(rawValue)
}
export function getSerializedValue(value: unknown): string | undefined {
	if (Array.isArray(value)) {
		return value.map(v => getPrimitiveValue(v)).filter(v => v != null).join(',')
	} else {
		return getPrimitiveValue(value)
	}
}

/**
 * Serialize top level keys of an object into a query string encoded list of key value pairs.
 *
 * i.e.
 *
 * ```jsx
 * stringify({ a: 'hello', b: 5, c: true })
 * // returns '?a=hello&b=5&c=true'
 *
 * stringify({ a: ['one', 'two'], b: 'three' })
 * // returns '?a=one&a=two&b=three'

* stringify({ sort: [['one', 1], ['two', -1]], b: 'three' })
 * // returns '?sort=one%2C1&sort=two%2C-1&b=three'
 * // NOTE: When parsing this value back, the array of arrays will be parsed as an array of strings: ['one,1', 'two,-1']
 *
 * ```
 * @param query
 * @returns Encoded query string starting with '?'
 */
export function stringify(query: Record<string, unknown> = {}): string {
	let result = ''
	let added = 0
	for (const key of Object.keys(query)) {
		let kvp: string
		const value = query[key]
		let encodedValue: string | undefined | string[]
		if (value != null) {
			if (Array.isArray(value)) {
				encodedValue = value.map((v) => {
					const serialized = getSerializedValue(v)
					return serialized != null ? encodeURIComponent(serialized) : undefined
				}).filter(v => v != null)
			} else {
				encodedValue = getSerializedValue(value)
			}
			if (encodedValue == null) continue
			// goal here is to serialize arrays as multiple key value pairs
			kvp = Array.isArray(encodedValue) ? encodedValue.map(v => `&${encodeURIComponent(key)}=${v}`).join('') : `${encodeURIComponent(key)}=${encodedValue}`
			if (kvp[0] === '&') kvp = kvp.substring(1) // trim off leading &
			if (added === 0) result += '?'
			else result += '&'
			result += kvp
			added++
		}
	}
	return result
}
/**
 * Parse a query string into a simple hash.
 *
 * ```jsx
 * parse('?a=hello&b=5&c=true')
 * // returns { a: 'hello', b: '5', c: 'true' }
 *
 * parse('?a=one&a=two&b=three')
 * // returns { a: ['one', 'two'], b: 'three' }
 * ```
 *
 * @param search Search query from the window.location
 * @returns Hashed value of query string params. Duplicate params will have an array of values in order.
 */
export function parse(search: string): Record<string, string | string[]> {
	const pairs = search.split(/[?&]/g)

	// group pairs by key to catch multiples
	const groups = {} as Record<string, string[]>
	pairs.forEach((p) => {
		const kvp = p.split('=')
		const [key, value] = kvp
		const pushValue = value != null
		if (pushValue) {
			if (groups[key] == null) groups[key] = []
			groups[key].push(decodeURIComponent(value))
		}
	})

	// break values out into an object
	const record: Record<string, string | string[]> = {}
	for (const key of Object.keys(groups)) {
		const values = groups[key]
		if (values.length > 1) {
			record[key] = values
		} else if (values.length === 1) {
			record[key] = values[0]
		}
	}

	return record
}
