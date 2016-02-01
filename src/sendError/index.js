import getEnvironment from '../watchers/environmentWatcher'
//import StackTrace from 'stacktrace-js'

export const sendError = (errorType, err) => {
	console.log(`${errorType}: ${err.message}`)

	Object.getOwnPropertyNames(err).forEach(e => console.log(`${e}: ${err[e]}`))


}
export const sendETrackFault = err => {
	console.log(`lib: ${err.stack}`)
}
