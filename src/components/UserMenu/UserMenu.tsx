'use client'

import styles from './UserMenu.module.scss'

type Props = {
	onProfileClick: () => void
	onLogoutClick: () => void
	email: string
}

export default function UserMenu({
	onProfileClick,
	onLogoutClick,
	email,
}: Props) {
	return (
		<div className={styles.menu}>
			<p className={styles.email}>{email}</p>

			<button className={styles.profile} onClick={onProfileClick}>
				Профиль
			</button>

			<button className={styles.logout} onClick={onLogoutClick}>
				Выйти
			</button>
		</div>
	)
}
