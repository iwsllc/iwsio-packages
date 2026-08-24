/**
 * True for a plain, mergeable record — an object literal or a null-prototype object.
 *
 * Deliberately narrow: `defaultsDeep` copies a record key-by-key via `Object.keys`, which
 * only sees enumerable own properties. Anything carrying its state in internal slots — a
 * `Blob`/`File` body, `FormData`, `URLSearchParams`, a stream, a `Map` — would survive that
 * copy as an empty `{}`, losing its contents. A `File` body silently became the string
 * "[object Object]" on the wire before this check was tightened.
 *
 * Testing for a plain prototype rather than excluding known classes means a type that is
 * not a plain object is never merged, including ones that do not exist yet.
 */
export const isRecordObject = (source: unknown): source is Record<string, unknown> => {
	if (typeof source !== 'object' || source === null) return false
	const proto = Object.getPrototypeOf(source)
	return proto === Object.prototype || proto === null
}
