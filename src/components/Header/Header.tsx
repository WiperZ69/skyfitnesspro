'use client'

import { logout } from '@/store/features/authSlice'
import { openAuthModal } from '@/store/features/uiSlice'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { Logo } from '../Logo/Logo'
import UserMenu from '../UserMenu/UserMenu'
import styles from './Header.module.scss'

export const Header = () => {
	const dispatch = useAppDispatch()
	const router = useRouter()

	const { user, isAuthenticated, isLoading } = useAppSelector(
		state => state.auth
	)

	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const menuRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setIsMenuOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const handleProfileClick = () => {
		setIsMenuOpen(false)
		router.push('/profile')
	}

	const handleLogout = () => {
		dispatch(logout())
		setIsMenuOpen(false)
	}

	return (
		<header className={styles.header}>
			<div className={styles.header__box}>
				<Logo />
				<h2 className={styles.header__title}>
					Онлайн-тренировки для занятий дома
				</h2>
			</div>

			{isLoading && <div className={styles.placeholder} />}

			{!isLoading && !isAuthenticated && (
				<button
					onClick={() => dispatch(openAuthModal('login'))}
					className={styles.header__button}
				>
					Войти
				</button>
			)}

			{!isLoading && isAuthenticated && user && (
				<div className={styles.userArea} ref={menuRef}>
					<div
						className={styles.userButton}
						onClick={() => setIsMenuOpen(prev => !prev)}
					>
						<img src='/profile.svg' alt='avatar' className={styles.avatar} />
						<p className={styles.username}>{user.email}</p>

						<img
							src='/expand.svg'
							alt='↓'
							className={`${styles.arrow} ${
								isMenuOpen ? styles.arrowOpen : ''
							}`}
						/>
					</div>

					{isMenuOpen && (
						<UserMenu
							onProfileClick={handleProfileClick}
							onLogoutClick={handleLogout}
							email={user.email}
						/>
					)}
				</div>
			)}
		</header>
	)
}
