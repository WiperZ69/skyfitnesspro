'use client'

import { authUser, getUser, registerUser } from '@/app/services/auth/authApi'
import {
	setIsAuthenticated,
	setSelectedCourses,
	setStorageLogin,
	setStorageToken,
} from '@/store/features/authSlice'
import { closeAuthModal, switchAuthModal } from '@/store/features/uiSlice'
import { useAppDispatch } from '@/store/store'
import axios from 'axios'
import classNames from 'classnames'
import { useState } from 'react'
import { Logo } from '../Logo/Logo'
import styles from './SignupForm.module.scss'

export const SignupForm = () => {
	const dispatch = useAppDispatch()
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		const form = e.target as HTMLFormElement
		const email = (form.email as HTMLInputElement).value.trim()
		const password = (form.password as HTMLInputElement).value.trim()
		const password2 = (form.password2 as HTMLInputElement).value.trim()

		if (!email || !password || !password2) {
			setError('Заполните все поля')
			setLoading(false)
			return
		}

		if (!email.includes('@')) {
			setError('Введите корректный email')
			setLoading(false)
			return
		}

		if (password !== password2) {
			setError('Пароли не совпадают')
			setLoading(false)
			return
		}

		if (password.length < 6) {
			setError('Пароль должен содержать минимум 6 символов')
			setLoading(false)
			return
		}

		if (!email || !password) {
			setError('Заполните все поля')
			return
		}

		try {
			await registerUser({ email, password })

			const token = await authUser({ email, password })
			const user = await getUser(token.token)
			dispatch(setIsAuthenticated(true))
			dispatch(setStorageLogin(user.user.email))
			dispatch(setStorageToken(token.token))
			dispatch(setSelectedCourses(user.user.selectedCourses || []))

			dispatch(closeAuthModal())
		} catch (err: unknown) {
			console.error('Ошибка регистрации:', err)

			if (axios.isAxiosError(err) && err.response?.status === 400) {
				const errorData = err.response.data
				setError(
					errorData.message || 'Пользователь с таким email уже существует'
				)
			} else {
				setError('Ошибка сервера. Попробуйте позже')
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className={styles.modal__form}>
			<Logo />

			<input
				className={classNames(styles.modal__input, styles.login)}
				type='text'
				name='email'
				placeholder='Почта'
				disabled={loading}
				required
			/>
			<input
				className={styles.modal__input}
				type='password'
				name='password'
				placeholder='Пароль'
				disabled={loading}
				required
			/>
			<input
				className={styles.modal__input}
				type='password'
				name='password2'
				placeholder='Повторите пароль'
				disabled={loading}
				required
			/>

			<div className={styles.errorContainer}>{error}</div>

			<button
				className={styles.modal__btnSignupEnt}
				type='submit'
				disabled={loading}
			>
				{loading ? 'Регистрация...' : 'Зарегистрироваться'}
			</button>

			<button
				type='button'
				className={styles.modal__btnSignupBack}
				onClick={() => dispatch(switchAuthModal('login'))}
				disabled={loading}
			>
				Войти
			</button>
		</form>
	)
}
