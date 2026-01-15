'use client'

import { authUser, getUser } from '@/app/services/auth/authApi'
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
import styles from './SigninForm.module.scss'

export const SigninForm = () => {
	const dispatch = useAppDispatch()
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		const form = e.target as HTMLFormElement
		const formData = new FormData(form)

		const email = formData.get('email') as string
		const password = formData.get('password') as string

		if (!email || !password) {
			setError('Введите email и пароль')
			setLoading(false)
			return
		}

		try {
			const { token } = await authUser({ email, password })
			const user = await getUser(token)

			if (user) {
				dispatch(setIsAuthenticated(true))
				dispatch(setStorageLogin(user.user.email))
				dispatch(setStorageToken(token))
				dispatch(setSelectedCourses(user.user.selectedCourses || []))

				dispatch(closeAuthModal())
			} else {
				setError('Ошибка авторизации')
			}
		} catch (err: unknown) {
			console.error('Ошибка входа:', err)

			if (axios.isAxiosError(err)) {
				const errorData = err.response?.data
				setError(errorData.message || 'Ошибка авторизации')
			} else {
				setError('Ошибка авторизации')
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<form className={styles.modal__form} onSubmit={handleSubmit}>
			<Logo />
			<input
				className={classNames(styles.modal__input, styles.login)}
				type='email'
				name='email'
				placeholder='Email'
				disabled={loading}
				required
				autoComplete='email'
			/>
			<input
				className={styles.modal__input}
				type='password'
				name='password'
				placeholder='Пароль'
				disabled={loading}
				required
				autoComplete='current-password'
			/>

			{error && <div className={styles.errorContainer}>{error}</div>}

			<button
				className={styles.modal__btnEnter}
				type='submit'
				disabled={loading}
			>
				{loading ? 'Вход...' : 'Войти'}
			</button>

			<button
				type='button'
				disabled={loading}
				className={styles.modal__btnSignup}
				onClick={() => dispatch(switchAuthModal('signup'))}
			>
				Зарегистрироваться
			</button>
		</form>
	)
}
