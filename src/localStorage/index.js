import { contain } from '../utils'

const STORAGE_LIST = ['localStorage', 'sessionStorage']

const checkAvaible = type => {
	if (!contain(STORAGE_LIST, type)) {
		throw new Error(`Unknown Storage Type, Please check again!`)
	} else {
		const storage = window[type]
		try {
			const x = '_just_test_storage_'
			storage.setItem(x, x)
			storage.removeItem(x)
			return true
		} catch (e) {
			return false
		}
	}

}

const empty = () => {
	localStorage.setItem('eTrackPack', '[]')
}

export const getAndEmpty = () => {
	if (!checkAvaible('localStorage')) return []
	const data = JSON.parse(localStorage.getItem('eTrackPack'))
	empty()
	return (Array.isArray(data)) && data
}

export const addItem = data => {
	if (!checkAvaible('localStorage')) return false
	const dataList = JSON.parse(localStorage.getItem('eTrackPack'))
	Array.isArray(dataList) && dataList.push(data)
	localStorage.setItem('eTrackPack', JSON.stringify(dataList))
	return true
}

export const initLocalStorage = () => {
	if (!checkAvaible('localStorage')) return console.info(`Browser dont surport window.localStorage`)
	if (!localStorage.getItem('eTrackPack')) empty()
}
