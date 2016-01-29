import { unid } from '../utils'

class Processes {
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

	add(catigory, value) {
		const id = unid()
		this.processes.push({id, catigory, value})
		this.truncate()
		console.log(this.processes[this.processes.length - 1])
		return id
	}
}

const logger = new Processes()
export default logger
