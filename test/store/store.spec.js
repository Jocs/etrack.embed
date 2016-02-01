import logger from '../../src/store'

describe('test logger:', () => {
	it('should be an empty logger', () => {
		expect(logger.getAll().length).toEqual(0)
	})

	it('when add one item to logger, the length should be 1', () => {
		logger.add('test', {hello: 'world'})
		expect(logger.getAll().length).toEqual(1)
		expect(logger.getAll()[0]['catigory']).toEqual('test')
		expect(typeof logger.getAll()[0]['value']).toEqual('object')
	})

	it('when add more than 30 item to logger, the length will be 30', () => {
		for(let i = 0; i < 40; i++) {
			logger.add('test', {hello: 'world'})
		}
		expect(logger.getAll().length).toEqual(30)
		logger.clear()
		expect(logger.getAll().length).toEqual(0)
	})

	it('when update the logger, the value will change', () => {
		const id = logger.add('test', {hello: 'world'})
		expect(logger.getAll()[0].value.hello).toEqual('world')
		logger.update('test', id, {foo: 'bar'})
		expect(logger.getAll()[0].value.foo).toEqual('bar')
	})
})