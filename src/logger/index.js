import { unid, extend } from '../utils'

class Logger {
	constructor() {
		this.processes = []
		this.MAX_STORAGE = 30
	}

	truncate() {
		while (this.processes.length > this.MAX_STORAGE) this.processes.shift()
	}

	clear() {
		this.processes.length = 0
	}

	getAll() {
		return this.processes
	}

	update(catigory, id, addedValue) {
		const processes = this.processes
		for (let i = 0, len = processes.length; i < len; i++) {
			if (catigory === processes[i].catigory && id === processes[i].id) {
				const oldValue = processes[i].value
				// processes[i].value = Object.assign({}, oldValue, addedValue)
				processes[i].value = extend({}, oldValue, addedValue)
				// console.log(processes[i].value) // 用于debugger
			}
		}
		return false
	}

	add(catigory, value) {
		const id = unid()
		this.processes.push({id, catigory, value})
		this.truncate()
		// console.log(this.processes[this.processes.length - 1]) // 用于调试，以后记得删除
		return id
	}
}

const logger = new Logger()

export default logger
