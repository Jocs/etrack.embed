import { sendError, sendETrackFault } from '../sendError'
import { wrapError } from '../utils'

const protectEntryPoint = fn => {
	return function protectedEntryPoint() {
		try {
			return fn(...arguments)
		} catch (err) {
			sendError('promise@catch', err)
			throw wrapError(err)
		}
	}
}

const _then = Promise.prototype.then

const initPromiseWatcher = constructor => {
	constructor.prototype.then = function(...args) {
		try {
			const newArgs = args.map(arg => {
				if (typeof arg === 'function') {
					return protectEntryPoint(arg)
				} else {
					return arg
				}
			})
			return _then.apply(this, newArgs)
		} catch (err) {
			sendETrackFault(err)
		}
	}
}

export default initPromiseWatcher
