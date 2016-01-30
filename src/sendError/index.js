import getEnvironment from '../watchers/environmentWatcher'

export const sendError = (errorType, err) => {
	console.log(err)
	console.log(getEnvironment())
}
export const sendETrackFault = err => {
	console.log(err)
}
