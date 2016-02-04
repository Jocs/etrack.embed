// TODO: 记录用户click\input的屏幕位置，用于标记在屏幕截图上面
import logger from '../logger'
import { getXPath, getCssSelector } from '../utils'

const onInputChanged = e => {
	if (e.target && !e.target.tagName) return // 解决Firefox中地址栏失去焦点也会触发 blur 事件 bug
	const target = e.target
	if (isDescribedElement(target, 'textarea')) {
		writeVisitorEvent(target, 'input', target.value)
	} else if (isDescribedElement(target, 'select') && target.options && target.options.length) {
		onSelectChanged(target)
	} else if (isDescribedElement(target, 'input') && !isDescribedElement(target, 'input', ['button', 'submit', 'hidden', 'radio', 'checkbox'])) {
		writeVisitorEvent(target, 'input', target.value)
	}
}

const onSelectChanged = target => {
	if (target.multiple) {
		target.options.forEach(option => writeVisitorEvent(target, 'input', option.value))
	} else {
		if (target.selectedIndex > -1 && target.options[target.selectedIndex]) {
			writeVisitorEvent(target, 'input', target.options[target.selectedIndex].value)
		}
	}
}

const onClicked = e => {
	const target = e.target
	if (isDescribedElement(target, 'a')	||
		isDescribedElement(target, 'input', ['button', 'submit']) ||
		isDescribedElement(target, 'button')) {

		writeVisitorEvent(target, 'click', target.textContent || target.value)
	} else if (isDescribedElement(target, 'input', ['checkbox', 'radio'])) {
		writeVisitorEvent(target, 'input', target.value, target.checked)
	}
}

const isDescribedElement = (element, tagName, typeArray) => {
	if (element.tagName.toLowerCase() !== tagName) return false
	if (!typeArray) return true
	const type = (element.getAttribute('type') || '').toLowerCase()
	return typeArray.some(t => type === t)
}

const writeVisitorEvent = (element, action, value, checked) => {
	let newValue = value
	if (element.getAttribute('type') && element.getAttribute('type').toLowerCase === 'password') {
		newValue = '密码不予显示'
	}
	logger.add('visitor', {
		timeStamp: +new Date(),
		action,
		element: {
			tag: element.tagName.toLowerCase(),
			attributes: getAttributes(element),
			value: newValue,
			xpath: getXPath(element),
			cssSelector: getCssSelector(element),
			checked
		}
	})
}

const getAttributes = element => {
	const results = {}
	const attrs = element.attributes
	for (let i = 0, len = attrs.length; i < len; i++) {
		if (attrs[i].name !== 'value') {
			results[attrs[i].name] = attrs[i].value
		}
	}
	return results
}

const initVisitorWatch = () => {
	if (document && document.addEventListener) {
		document.addEventListener('click', onClicked, true)
		document.addEventListener('blur', onInputChanged, true)
	}
}

export default initVisitorWatch
