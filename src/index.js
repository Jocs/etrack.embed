import catchAndWatch from './watchers/callbackWatcher'
import initVisitorWatch from './watchers/visitorWatcher'
import initConsoleWatcher from './watchers/consoleWatcher'
import initAJAXWatcher from './watchers/networkWatcher'
import initPromiseWatcher from './watchers/promiseWatcher'

catchAndWatch.initialize()
initVisitorWatch()
initConsoleWatcher()
initAJAXWatcher(window.XMLHttpRequest)
initPromiseWatcher(Promise)
