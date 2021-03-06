export const unid = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, a => {
		const b = 16 * Math.random() | 0
		return (a === 'x' ? b : b & 3 | 8).toString(16)
	})
}

const isNullOrEmpty = o => o === null || o === '' || undefined === o

const getAttr = element => {
	const tagName = element.tagName.toLowerCase()
	const id = element.getAttribute('id')
	const hasId = !isNullOrEmpty(id)
	if (hasId) {
		return `[@id='${id}']`
	} else {
		if (element.parentNode && element.parentNode.getElementsByTagName(tagName).length > 1) {
			let i = 1
			while (element.previousElementSibling) {
				if (element.previousElementSibling.tagName.toLowerCase() === tagName) {
					i++
				}
				element = element.previousElementSibling
			}
			return `[${i}]`
		} else {
			return ''
		}
	}
}

const getPath = (element, path) => {
	const tagName = element.tagName
	if (isNullOrEmpty(element) || isNullOrEmpty(tagName)) {
		return path
	}
	const attr = getAttr(element)
	const token = tagName.toLowerCase() + attr
	const selector = isNullOrEmpty(path) ? token : `${token}/${path}`
	const parentElement = element.parentNode
	if (isNullOrEmpty(parentElement) || attr.substring(0, 5) === '[@id=') {
		return selector
	}
	return getPath(parentElement, selector)
}

export const getXPath = element => {
	const path = getPath(element, '')
	return `//${path}`
}

export const getCssSelector = element => {
	const xPath = getXPath(element)
	const token = xPath.substring(2).split('/')
	return token.reduce((prev, next) => {
		if (/@id/.test(next)) {
			const match = /\[@id\='([a-zA-Z0-9\-_]+)'\]/.exec(next)
			return prev === '' ? `#${match[1]}` : `${prev}>#${match[1]}`
		} else if (/\[\d+\]$/.test(next)) {
			const match = /([a-z]+\d*)\[(\d+)\]$/.exec(next)
			return prev === '' ? `${match[1]}:nth-of-type(${match[2]})`
			: `${prev}>${match[1]}:nth-of-type(${match[2]})`
		} else {
			return prev === '' ? next : `${prev}>${next}`
		}
	}, '')
}

export const getElementPosition = element => {
	let currentWindow = window
	let rect = element.getBoundingClientRect()
	let top = rect.top
	let left = rect.left
	while (currentWindow.frameElement !== null) {
		element = currentWindow.frameElement
		currentWindow = currentWindow.parent
		rect = element.getBoundingClientRect()
		if (rect.top > 0) top = top + rect.top
		if (rect.left > 0) left = left + rect.left
	}
	return {
		top: Math.floor(top),
		left: Math.floor(left)
	}
}

export const serialize = msg => {
	if (msg === undefined || msg === null) return 'undefined or null'
	if (typeof msg === 'number' && isNaN(msg)) return 'NaN'
	if (typeof msg === 'string' && msg === '') return 'empty string'
	if (msg.toString) return msg.toString()
}

export const wrapError = err => {
	if (err.innerError) return err

	let newError = Error(`eTrack Caught: ${err.message || err}`)
	// use try/catch block to avoid safari than can's re assign 'line' and 'column' properties
	// because the two properties writable is false.
	try {
		newError.description = `eTrack Caught: ${err.description}`
		newError.file = err.file
		newError.line = err.line || err.lineNumber
		newError.column = err.column || err.columnNumber
		newError.stack = err.stack
		newError.innerError = err
		newError.isReported = true
	} catch (e) {}

	return newError
}

// just like Object.assign
export const extend = (...args) => {
	const argsLists = args.slice(1)
	argsLists.forEach(item => {
		if (typeof item === 'object' && Object.prototype.toString.call(item) === '[object Object]') {
			for (let props in item) {
				if (item.hasOwnProperty(props)) {
					args[0][props] = item[props]
				}
			}
		}
	})
	return args[0]
}

export const contain = (array, item) => {
	if (!Array.isArray(array)) return false
	for (let i = 0, len = array.length; i < len; i++) {
		if (array[i] === item) return true
	}
	return false
}
