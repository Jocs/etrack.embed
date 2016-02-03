import config from '../config'
import { sendETrackFault } from '../reportor'
import UAParser from 'ua-parser-js'

const uaParser = new UAParser()
const LOADED_ON = +new Date()
let currentPosition = null

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

const getCurrentLocation = function getCurrentLocation() {
	const options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	}

	const promise = new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(pos => {

			resolve(pos.coords)
		}, err => {
			reject(err)
		}, options)
	})

	return promise

}

if (config.canIGetCurrentPosition) {
	getCurrentLocation()
	.then(pos => currentPosition = pos)
	.catch(err => sendETrackFault(err))
}

const getCurrentUser = () => {
	const domain = document.domain
	const domainParts = /(.*)-/.exec(domain)
	if (domainParts && domainParts[0] && domainParts[1]) {
		return domainParts[1]
	} else {
		return '未知用户'
	}
}

const getEnvironment = () => {

	return {
		currentUser: getCurrentUser(),
		location: currentPosition,
		loadon: LOADED_ON,
		runTime: +new Date() - LOADED_ON,
		url: (window.location || '').toString(),
		dependencies: discoverDependencies(),
		userAgentInfo: uaParser.getResult(),
		version: config.version,
		viewportHeight: window.document.documentElement.clientHeight,
		viewportWidth: window.document.documentElement.clientWidth
	}

}

export default getEnvironment
