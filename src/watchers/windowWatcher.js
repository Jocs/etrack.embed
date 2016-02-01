import { sendError, sendETrackFault } from '../sendError'
import { serialize } from '../utils'

let isWindowErrorWatched = false

const initWindowWatcher = win => {
	if (isWindowErrorWatched) return
	const _oldOnError = win.onerror ? win.onerror : null
	win.onerror = function(msg, url, line, col, err = {}) {
		let error
		try {
			error = err || {}
			error.message = err.message || serialize(msg)
			error.line = err.line || err.lineNumber || parseInt(line, 10) || null
			error.file = err.file || err.fileName || serialize(url)
			error.column = err.column || err.columnNumber || parseInt(col, 10) || null
			sendError('window@onerror', error)
		} catch (e) {
			sendETrackFault(e)
		}
		(typeof _oldOnError === 'function') && _oldOnError.apply(this, [...arguments])
	}
	isWindowErrorWatched = true
}

export default initWindowWatcher
