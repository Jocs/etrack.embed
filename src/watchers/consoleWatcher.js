import { sendError, sendETrackFault } from '../sendError'
import { serialize } from '../utils'
import logger from '../store'

const WATCH_LIST = ['debug', 'info', 'warn', 'error']

const wrapConsoleObject = function(console) {
	WATCH_LIST.forEach(item => {
		const _method = console[item]
		console[item] = function(...args) {
			try {
				logger.add('console', {
					timeStamp: +new Date(),
					severity: item,
					message: serialize(args)
				})
				if (item === 'error') {
					try {
						throw new Error(serialize(args))
					} catch (err) {
						sendError('console', err)
					}
				}
				_method.apply(this, args)
			} catch (err) {
				sendETrackFault(err)
			}
		}
	})
}

const consoleWatcher = function() {
	window && window.console && wrapConsoleObject(window.console)
}

export default consoleWatcher
