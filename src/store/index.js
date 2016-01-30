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
	/**
	 * [get 根据catigory 和 id 值获取某一个步骤，主要用于XMLHttpRequest监听时，写入responseText 以及完成时间戳]
	 * @param  {[string]} catigory            [步骤分类]
	 * @param  {[string]} id                  [process唯一id]
	 * @return {[object or boolean]}          [返回步骤的引用或者返回false没有找到]
	 */
	get(catigory, id) {
		const processes = this.processes
		for (let i = 0, len = processes.length; i < len; i++) {
			if (catigory === processes[i].catigory && id === processes[i].id) {
				return processes[i].value
			}
		}
		return false
	}

	add(catigory, value) {
		const id = unid()
		this.processes.push({id, catigory, value})
		this.truncate()
		console.log(this.processes[this.processes.length - 1]) // 用于调试，以后记得删除
		return id
	}
}

const logger = new Processes()

export default logger
