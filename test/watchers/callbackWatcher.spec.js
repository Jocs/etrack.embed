import callbackWatcher from '../../src/watchers/callbackWatcher'
import { report } from '../../src/reportor'

describe('test callbackWatcher:', () => {
	beforeEach(() => {
		callbackWatcher.initialize()
	})
	it('shold work well when use addEventListener and removeEventListener.', () => {
		const button = document.createElement('button')
		let counter = 0
		const listener = () => counter++
		button.addEventListener('click', listener, false)
		expect(counter === 0).toBe(true)
		button.click()
		expect(counter === 1).toBe(true)
		button.removeEventListener('click', listener, false)
		button.click()
		expect(counter === 1).toBe(true)
	})

	
})
