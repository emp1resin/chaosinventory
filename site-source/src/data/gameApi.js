export async function fetchGameJson(url) {
	let lastError
	for (let attempt = 0; attempt < 2; attempt++) {
		const controller = new AbortController()
		const timeout = setTimeout(() => controller.abort(), 15000)
		try {
			const response = await fetch(url, {signal: controller.signal})
			if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
			const body = await response.text()
			return body ? JSON.parse(body) : null
		} catch (error) {
			lastError = error
			if (attempt === 0) await new Promise(resolve => setTimeout(resolve, 350))
		} finally {
			clearTimeout(timeout)
		}
	}
	throw new Error(`Игровой API не ответил: ${url.split('?')[0]} (${lastError?.message || 'ошибка сети'})`)
}

export async function fetchOptionalGameJson(url) {
	try {
		return await fetchGameJson(url)
	} catch (error) {
		console.warn('Дополнительные данные временно недоступны', error)
		return null
	}
}

