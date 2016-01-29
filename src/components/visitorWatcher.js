import logger from '../store'
import { getXPath } from '../utils'
/**
 * 以前思路是在通过addEventListener的时候，对listener进行改写，来搜集用户操作信息，
 * 这样做的目的，就是防止因为阻止冒泡而导致添加到document上面的事件监听，监听不到事件。
 * 后来发现，这样做根本多余了，我们在document添加事件的时候，只要给addEventListener
 * 传递第三个参数，为true时，这样就在捕获阶段就搜集用户操作信息，就不用管是否阻止冒泡了。
 */
// export const handleVisotorOperation = (eventType, e) => {
// 	e.preventDefault()
// 	e.stopPropagation()
// 	switch (eventType) {
// 		case 'click':
// 			onClicked(e)
// 			break
// 		case 'blur':
// 			onInputChanged(e)
// 			break
// 		default:
// 			break
// 	}
// }

const onInputChanged = e => {
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
