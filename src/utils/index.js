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

export const serialize = msg => {
	if (msg === undefined || msg === null) return 'undefined or null'
	if (typeof msg === 'number' && isNaN(msg)) return 'NaN'
	if (typeof msg === 'string' && msg === '') return 'empty string'
	if (msg.toString) return msg.toString()
}

export const wrapError = err => {
	if (err.innerError) return err

	let newError = Error(`eTrack Caught: ${err.message || err}`)
	newError.description = `eTrack Caught: ${err.description}`
	newError.file = err.file
	newError.line = err.line || err.lineNumber
	newError.column = err.column || err.columnNumber
	newError.stack = err.stack
	newError.innerError = err
	newError.isReported = true

	return newError
}
