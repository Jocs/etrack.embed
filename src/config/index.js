const config = {
	version: '0.0.1',
	canIGetCurrentPosition: true,
	ScriptError: false,
	callbackWatcherBrowsers: ['Safari'],
	MAX_TRY: 3, // Send data, if failed, try again, but not more than 3 times
	errorCaptureURL: '/capture',
	eTrackFaultURL: '/fault'
}
export default config
