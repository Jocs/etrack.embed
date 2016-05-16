/**
 * create by Jocs modify at 2016.05.16
 */

let canIGetCurrentPosition = false
let deDuplicate = false
let ScriptError = false

if (window.eTrack.position !== undefined) canIGetCurrentPosition = window.eTrack.position
if (window.eTrack.deDuplicate !== undefined) deDuplicate = window.eTrack.deDuplicate
if (window.eTrack.ScriptError !== undefined) ScriptError = window.eTrack.ScriptError

const config = {
	version: '0.0.1',
	canIGetCurrentPosition,
	deDuplicate,
	ScriptError,
	callbackWatcherBrowsers: ['Safari'],
	MAX_TRY: 3, // Send data, if failed, try again, but not more than 3 times
	errorCaptureURL: 'http://139.196.50.67:18080/api/error/capture',
	eTrackFaultURL: 'http://139.196.50.67:18080/api/error/fault'
}
export default config
