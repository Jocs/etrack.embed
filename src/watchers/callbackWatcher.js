import { report, sendETrackFault } from '../reportor'
import { wrapError } from '../utils'

class EventsCollections {
	constructor() {
		this.events = []
	}

	indexOf(eventType, callback, isPropogation) {
		let index = -1
		this.events.forEach((event, i) => {
			if (event[0] === eventType && event[1] === callback && event[2] === isPropogation) {
				index = i
			}
		})
		return index
	}

	add(eventType, callback, isPropogation, wrapedCallback) {
		this.indexOf(eventType, callback, isPropogation) <= -1 && this.events.push([...arguments])
	}

	remove(eventType, callback, isPropogation) {
		const index = this.indexOf(...arguments)
		index > -1 && this.events.splice(index, 1)
	}

	getWrapped(eventType, callback, isPropogation) {
		const index = this.indexOf(...arguments)
		return index > -1 ? this.events[index][3] : null
	}
}

const eventsCollection = new EventsCollections()

class WrapAsyncCallback {
	constructor() {}
	initialize() {
		// Safari 不支持EventTarget，所以只能够分开使用window.Element 和 window.XMLHttpRequest
		this.wrapCatchAndWatch(window.Element.prototype, 'addEventListener', 1)
		this.wrapCatchAndWatch(window.XMLHttpRequest.prototype, 'addEventListener', 1)
		this.wrapRemoveEventListener(window.Element.prototype)
		this.wrapRemoveEventListener(window.XMLHttpRequest.prototype)

		this.wrapCatchAndWatch(window, 'setTimeout', 0)
		this.wrapCatchAndWatch(window, 'setInterval', 0)
	}

	wrapCatchAndWatch(object, method, cbPosition) {
		const _method = object[method]

		object[method] = function(...args) {
			try {
				const _callback = args[cbPosition]

				args[cbPosition] = e => {
					try {

						_callback(e)

					} catch (err) {
						report('callback@catch', err)
						throw wrapError(err)
					}
				}
				if (method === 'addEventListener') {
					eventsCollection.add(args[0], _callback, args[2], args[cbPosition])
				}
				return _method.apply(this, args)

			} catch (err) {
				object[method] = _method
				sendETrackFault(err)
			}
		}
	}

	wrapRemoveEventListener(object) {
		const _removeEventListener = object.removeEventListener
		object.removeEventListener = function(eventType, callback, isPropogation = false) {
			if (eventsCollection.indexOf(...arguments) > -1) {
				const wrapedFn = eventsCollection.getWrapped(...arguments)
				eventsCollection.remove(...arguments)
				return _removeEventListener.call(this, eventType, wrapedFn, isPropogation)
			}
			return _removeEventListener.call(this, ...arguments)
		}
	}
}

const callbackWatcher = new WrapAsyncCallback()

export default callbackWatcher

