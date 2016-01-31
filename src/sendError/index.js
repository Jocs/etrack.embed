import getEnvironment from '../watchers/environmentWatcher'

export const sendError = (errorType, err) => {
	console.log(`${errorType}: ${err.message}`)
}
export const sendETrackFault = err => {
	console.log(`lib: ${err}`)
}
