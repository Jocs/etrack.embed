import getEnvironment from '../watchers/environmentWatcher'
import logger from '../logger'
import config from '../config'

export const report = (errorType, err) => {
	const error = formatError(err)
	const dataPack = getDataPack(errorType, error)
	sendError(config.errorCaptureURL, dataPack)
}

const getDataPack = (errorType, error) => {
	return {
		errorType,
		error,
		logger: logger.getAll(),
		environment: getEnvironment()
	}
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
			if (req.status >= 200 && req.status < 400) {
				resolve(req.responseText)
			} else {
				reject(`eTrack POST to ${url} failed with status: ${req.status}`)
			}
		}
		req.open('post', url)
		req.setRequestHeader('Content-Type', 'application/json')
		req.send(JSON.stringify(dataPack))
	})
}

const sendError = (url, dataPack) => {
	let tryCount = 0
	let isSended = false
	const MAX_TRY = config.MAX_TRY
	while (tryCount <= MAX_TRY && !isSended) {
		ajax(url, dataPack)
		.then(response => {
			console.log(`eTrack dataPack POST to ${url} successfully, with the responseText: ${response}`)
			isSended = true
		})
		.catch(errMsg => {
			if (tryCount === 3) console.log(errMsg)
			tryCount++
		})
	}
}

export const sendETrackFault = err => {
	ajax(config.eTrackFaultURL, formatError(err))
	.then(responseText => console.log(`eTrack Fault send successfully: ${responseText}`))
	.catch(errMsg => console.log(errMsg))
}
