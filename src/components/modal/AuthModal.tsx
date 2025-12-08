'use client'

import { closeAuthModal } from '@/store/features/uiSlice'
import { useAppDispatch, useAppSelector } from '@/store/store'
import styles from './AuthModal.module.scss'
import { SigninForm } from './SigninForm'
import { SignupForm } from './SignupForm'

export const AuthModal = () => {
	const dispatch = useAppDispatch()
	const { isOpen, type } = useAppSelector(state => state.ui.authModal)

	if (!isOpen) return null

	return (
		<div className={styles.modal} onClick={() => dispatch(closeAuthModal())}>
			<div className={styles.modal__block} onClick={e => e.stopPropagation()}>
				{type === 'login' && <SigninForm />}
				{type === 'signup' && <SignupForm />}
			</div>
		</div>
	)
}
