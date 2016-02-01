import getEnvironment from '../watchers/environmentWatcher'

export const sendError = (errorType, err) => {
	console.log(`${errorType}: ${err.message}`)
	console.log(getEnvironment())
}
export const sendETrackFault = err => {
	console.log(`lib: ${err}`)
}
