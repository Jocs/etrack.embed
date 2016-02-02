import { report, sendETrackFault } from '../reportor'
import { wrapError } from '../utils'

const protectEntryPoint = fn => {
	return function protectedEntryPoint() {
		try {
			return fn(...arguments)
		} catch (err) {
			report('promise@catch', err)
			// throw the wrapped err to ensure than catch block can catch this error.
			throw wrapError(err)
		}
	}
}

const initPromiseWatcher = constructor => {
	const _then = constructor.prototype.then
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
