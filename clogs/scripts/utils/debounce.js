
export const debounce = (fn, dueTime) => {
	let timer = null
	return function(...args) {
		if (timer) {
			clearTimeout(timer)
			timer = null
		}
		timer = setTimeout(fn.bind(this, args), dueTime)
	}
}
