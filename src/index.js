import catchAndWatch from './components/callbackWatcher'
import initVisitorWatch from './components/visitorWatcher'
import initConsoleWatcher from './components/consoleWatcher'
import initAJAXWatcher from './components/networkWatcher'

catchAndWatch.initialize()
initVisitorWatch()
initConsoleWatcher()
initAJAXWatcher(window.XMLHttpRequest)
