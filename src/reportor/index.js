import getEnvironment from '../watchers/environmentWatcher'
import logger from '../logger'
import config from '../config'
import { getAndEmpty, addItem } from '../localStorage'

const MAX_TRY = config.MAX_TRY
let lastErrorMessage = ''

export const report = (errorType, err) => {
	const error = formatError(err)
	if (config.deDuplicate && error.message === lastErrorMessage) return false
	lastErrorMessage = error.message
	const dataPack = getDataPack(errorType, error)
	const dataPackList = getAndEmpty()
	dataPackList.push(dataPack)
	dataPackList.forEach(pack => sendError(config.errorCaptureURL, pack))
}

const getDataPack = (errorType, error) => {
	const dataPack = {
		tryCount: 0, // 用于记录发送次数
		errorType,
		error,
		logger: logger.getAll(),
		environment: getEnvironment(),
		time: +new Date(),
		applicationId: window.eTrack && window.eTrack.appId || null
	}
	return dataPack
}

const formatError = err => {
	return {
		message: err.message || null,
		fileName: err.file || err.sourceURL || err.fileName || null,
		lineNumber: err.line || err.lineNumber || null,
		columnNumber: err.column || err.columnNumber || null,
		stack: err.stack || null
	}
}

const ajax = (url, dataPack) => {
	return new Promise((resolve, reject) => {
		const req = new XMLHttpRequest()
		req.onerror = reject
		req.onreadystatechange = function onreadystatechange() {
			if (req.readyState === 4) {
				if (req.status >= 200 && req.status < 400) {
					resolve(req.responseText)
				} else {
					reject(`eTrack POST to ${url} failed with status: ${req.status}`)
				}
			}
		}
		req.open('post', url)
		req.setRequestHeader('Content-Type', 'application/json')
		req.send(JSON.stringify(dataPack))
	})
}

const sendError = (url, dataPack) => {

	ajax(url, dataPack)
	.then(response => {
		logger.clear()
		// console.log(`eTrack dataPack POST to ${url} successfully, with the responseText: ${response}`)
	})
	.catch(errMsg => {
		dataPack.tryCount++
		if (dataPack.tryCount < MAX_TRY) {
			sendError(url, dataPack)
		} else {
			dataPack.tryCount = 0
			addItem(dataPack)
			logger.clear()
			console.log(errMsg)
		}
	})
}

export const sendETrackFault = err => {
	ajax(config.eTrackFaultURL, formatError(err))
	.then(responseText => {
		// console.log(`eTrack Fault send successfully with the responseText: ${responseText}`)
	})
	.catch(errMsg => console.log(errMsg))
}
