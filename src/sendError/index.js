import getEnvironment from '../components/environmentWatcher'

export const sendError = (err) => {
	console.log(err.stack)
	console.log(getEnvironment())
}
