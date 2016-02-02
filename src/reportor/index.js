import getEnvironment from '../watchers/environmentWatcher'

export const report = (errorType, err) => {
	console.log(`${errorType}: ${err.message || err}`)

	// Object.getOwnPropertyNames(err).forEach(e => console.log(`${e}: ${err[e]}`))
	// console.log(err.line, err.lineNumber)
	// console.log(err.column, err.columnNumber)
	// console.log(err.file, err.fileName)
	// console.log(err.stack)

	//console.log(getEnvironment())
}
export const sendETrackFault = err => {
	console.log(`lib: ${err.stack}`)
}
