export class FetchError<T = unknown> extends Error {
	body: T | string | undefined
	isJson: boolean
	status: number | undefined

	constructor(message: string, status: number | undefined, body?: T | string) {
		super(message)
		this.status = status
		this.body = body
		this.isJson = typeof body !== 'string'
	}

	resolveMessage() {
		let message
		if (this.body == null) message = this.message
		else {
			// try to extract a message from the body
			if (typeof this.body === 'string') message = this.body as string
			else if (typeof this.body === 'object') {
				// a couple guesses
				if ('message' in this.body && typeof this.body.message === 'string') message = this.body.message
				if ('error' in this.body && typeof this.body.error === 'string') message = this.body.error
			}
		}
		return message
	}

	toString() {
		return `${this.message} - Status: ${this.status} - ${this.resolveMessage()}`
	}
}
