import catchAndWatch from './components/callbackWatcher'
import initVisitorWatch from './components/visitorWatcher'
import initConsoleWatcher from './components/consoleWatcher'

catchAndWatch.initialize()
initVisitorWatch()
initConsoleWatcher()
