import callbackWatcher from './watchers/callbackWatcher'
import initVisitorWatcher from './watchers/visitorWatcher'
import initConsoleWatcher from './watchers/consoleWatcher'
import initAJAXWatcher from './watchers/networkWatcher'
import initPromiseWatcher from './watchers/promiseWatcher'
import initWindowWatcher from './watchers/windowWatcher'
import UAParser from 'ua-parser-js'
import config from './config'
import { contain } from './utils'

const parser = new UAParser()
const browserName = parser.getResult().browser.name

if (browserName && contain(config.callbackWatcherBrowsers, browserName)) {
	callbackWatcher.initialize()
}
initVisitorWatcher()
initConsoleWatcher()
initAJAXWatcher(window.XMLHttpRequest)
initPromiseWatcher(Promise)
initWindowWatcher(window)
