import config from '../config'

const LOADED_ON = +new Date()

const discoverDependencies = function() {
	const results = {}
	if (window.jQuery && window.jQuery.fn && window.jQuery.fn.jquery) {
		results.jQuery = window.jQuery.fn.jquery
	}
	if (window.jQuery && window.jQuery.ui && window.jQuery.ui.version) {
		results.jQueryUI = window.jQuery.ui.version
	}
	if (window.angular && window.angular.version && window.angular.version.full) {
		results.angular = window.angular.version.full
	}

	for (let a in window) {
		if (a !== 'etrack' &&
			a !== 'webkitStorageInfo' &&
			a !== 'webkitIndexedDB' &&
			a !== 'top' &&
			a !== 'parent' &&
			a !== 'frameElement') {
			if (window[a]) {
				const version = window[a].version || window[a].Version || window[a].VERSION
				if (typeof version === 'string' && version !== '') {
					results[a] = version
				}
			}
		}
	}
	return results
}

const getEnvironment = () => {
	return {
		loadon: LOADED_ON,
		age: +new Date() - LOADED_ON,
		url: (window.location || '').toString(),
		dependencies: discoverDependencies(),
		userAgent: window.navigator.userAgent,
		version: config.version,
		viewportHeight: window.document.documentElement.clientHeight,
		viewportWidth: window.document.documentElement.clientWidth
	}
}

export default getEnvironment
