import { sendError, sendETrackFault } from '../sendError'
import { serialize } from '../utils'
import config from '../config'

let isWindowErrorWatched = false

const initWindowWatcher = win => {
	if (isWindowErrorWatched) return
	const _oldOnError = win.onerror ? win.onerror : null
	win.onerror = function(msg, url, line, col, err = {}) {
		// 如果错误已经被 eTrack 捕获，那么 window.onerror 就不再 report 该错误
		if (/eTrack\s{1}Caught:/.test(msg) || (err.isReported && err.isReported === true)) return
		// 是否过滤 Script error (default dont collect Script error)
		if (!config.ScriptError && /Script\s{1}error/.test(msg)) return

		let error
		try {
			error = err || {}
			error.message = err.message || serialize(msg)
			error.line = err.line || err.lineNumber || parseInt(line, 10) || null
			error.file = err.file || err.fileName || serialize(url)
			error.column = err.column || err.columnNumber || parseInt(col, 10) || null
			error.stack = err.stack || null
			sendError('window@onerror', error)
		} catch (e) {
			sendETrackFault(e)
		}
		(typeof _oldOnError === 'function') && _oldOnError.apply(this, [...arguments])
	}
	isWindowErrorWatched = true
}

export default initWindowWatcher
