import { isRecordObject } from './isRecordObject.js'

/**
 * Shallow defaults. This basically assigns in when target is undefined.
 *
 * i.e.
 *
 * ```
 * defaults({a: 1}, {b: 2}, {b: 3, c: 4})
 * result: {a: 1, b: 2, c: 4}
 * ```
 *
 * @param dest destination object.
 * @param sources params sources applied sequentially left to right.
 * @returns
 */
export const defaults = (dest: Record<string, unknown>, ...sources: Record<string, unknown>[]) => {
	if (sources == null || sources.length === 0) return dest

	// for each source
	for (const source of sources) {
		const keys = Object.keys(source)
		// for each key
		for (const key of keys) {
			if (dest[key] == null && source[key] != null) {
				// prop doesn't exist on dest
				dest[key] = source[key]
			}
		}
	}

	return dest
}

/**
 * Deep defaults. This basically assigns in when target prop is undefined and recurses through source object props, left to right.
 *
 * i.e.
 *
 * ```
 * defaults({a: 1, d: { f: 1 }}, {b: 2}, {b: 3, c: 4}, {d: {e: 5, f: 2}})
 * result: {a: 1, b: 2, c: 4, d: { e: 5, f: 1}}
 * ```
 *
 * @param dest destination object.
 * @param sources params sources applied sequentially left to right.
 * @returns
 */
export const defaultsDeep = (dest: Record<string, unknown>, ...sources: Record<string, unknown>[]) => {
	if (sources == null || sources.length === 0) return dest

	// for each source
	for (const source of sources) {
		const keys = Object.keys(source)
		// for each key
		for (const key of keys) {
			const destValue: unknown = dest[key]
			const sourceValue = source[key]
			if (destValue == null && sourceValue != null) {
				// prop doesn't exist on dest
				if (isRecordObject(sourceValue)) {
					dest[key] = defaultsDeep({}, sourceValue)
				} else dest[key] = sourceValue
			} else {
				if (isRecordObject(destValue)) {
					if (isRecordObject(sourceValue)) {
						dest[key] = defaultsDeep(destValue, sourceValue)
					} // else ignore. source is not an object
				} // else ignore; dest is not an object
			}
		}
	}

	return dest
}
