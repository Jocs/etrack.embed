import logger from '../store'
import { report, sendETrackFault } from '../reportor'

const initAJAXWatcher = xhr => {
	const _open = xhr.prototype.open
	const _send = xhr.prototype.send

	xhr.prototype.open = function(...args) {
		this._ajaxInfo = {method: args[0], url: args[1]} // _ajaxInfo 用于缓存ajax请求相关信息
		_open.apply(this, args)
	}

	xhr.prototype.send = function(...args) {
		try {
			if (!this._ajaxInfo) return _send.apply(this, args)
			this._ajaxInfo.id = logger.add('ajax', {
				startedOn: +new Date(),
				method: this._ajaxInfo.method,
				url: this._ajaxInfo.url
			})
			listenForAJAXComplete(this)
		} catch (err) {
			sendETrackFault(err)
		}
		_send.apply(this, args)
	}
	return xhr
}

const listenForAJAXComplete = xhr => {
	try {

		xhr.addEventListener('readystatechange', () => {
			xhr.readyState === 4 && complieAJAXListen(xhr)
		}, true)

		xhr.addEventListener('load', () => {
			complieAJAXListen(xhr)
			checkAJAXError(xhr)
		}, true)

	} catch (err) {
		sendETrackFault(err)
	}
}

const complieAJAXListen = xhr => {
	if (xhr._ajaxInfo) {
		logger.update('ajax', xhr._ajaxInfo.id, {
			endOn: +new Date(),
			statusCode: xhr.status === 1223 ? 204 : xhr.status,
			statusText: xhr.status === 1223 ? 'No Content' : xhr.statusText,
			responseText: xhr.responseText,
			responseType: xhr.responseType
		})
	}
}

const checkAJAXError = xhr => {
	if (xhr._ajaxInfo) {
		if (xhr.status >= 400 && xhr.status !== 1223) {
			const ajaxInfo = xhr._ajaxInfo
			report('ajax@error', `${xhr.status}: ${xhr.statusText} ${ajaxInfo.method} ${ajaxInfo.url}`)
		}
	}
}

export default initAJAXWatcher

