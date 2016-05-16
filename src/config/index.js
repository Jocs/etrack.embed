const config = {
	version: '0.0.1',
	canIGetCurrentPosition: true,
	ScriptError: false,
	callbackWatcherBrowsers: ['Safari'],
	MAX_TRY: 3, // Send data, if failed, try again, but not more than 3 times
	errorCaptureURL: 'http://139.196.50.67:18080/api/error/capture',
	eTrackFaultURL: 'http://139.196.50.67:18080/api/error/fault'
}
export default config
