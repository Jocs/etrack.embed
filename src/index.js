import callbackWatcher from './watchers/callbackWatcher'
import initVisitorWatcher from './watchers/visitorWatcher'
import initConsoleWatcher from './watchers/consoleWatcher'
import initAJAXWatcher from './watchers/networkWatcher'
import initPromiseWatcher from './watchers/promiseWatcher'
import initWindowWatcher from './watchers/windowWatcher'
import UAParser from 'ua-parser-js'
import config from './config'
import { contain } from './utils'
import { initLocalStorage } from './localStorage'

const parser = new UAParser()
const browserName = parser.getResult().browser.name
// Becasuse Safari and IE dont have the 5th argument in window.onerror callback.
// So we try our best to catch error in try/catch block in Safari browser.
if (browserName && contain(config.callbackWatcherBrowsers, browserName)) {
	callbackWatcher.initialize()
}
initVisitorWatcher()
initConsoleWatcher()
initAJAXWatcher(window.XMLHttpRequest)
initPromiseWatcher(Promise)
initWindowWatcher(window)
initLocalStorage()
