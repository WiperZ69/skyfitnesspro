'use client'
import { useState } from 'react'

export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	async function submit(e: React.FormEvent) {
		e.preventDefault()
		setError('')

		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				body: JSON.stringify({ email, password }),
			})

			const data = await res.json()

			if (!res.ok) {
				setError(data.message)
				return
			}

			window.location.href = '/'
		} catch (error: any) {
			setError('Ошибка сервера')
		}
	}

	return (
		<div>
			<h1>Войти</h1>
			<form onSubmit={submit}>
				<input
					placeholder='Email'
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
				<input
					placeholder='Пароль'
					type='password'
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
				<button type='submit'>Войти</button>
				{!!error && <p style={{ color: 'red' }}>{error}</p>}
			</form>
		</div>
	)
}
