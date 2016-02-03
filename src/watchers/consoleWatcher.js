import { report, sendETrackFault } from '../reportor'
import { serialize } from '../utils'
import logger from '../logger'

// 不搜集console.log，因为console.log主要用于代码调试，搜集没多大意义
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
						report('console@error', err)
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
