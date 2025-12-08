export async function api(path: string, options: RequestInit = {}) {
	const res = await fetch(`/api${path}`, {
		...options,
		headers: {
			'Content-Type': '',
			...(options.headers || {}),
		},
	})

	if (!res.ok) {
		const err = await res.json()
		throw new Error(err.message || 'Ошибка запроса')
	}

	return res.json()
}
