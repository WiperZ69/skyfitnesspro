import styles from './UserProfile.module.scss'

export default function ProfileLoading() {
	return (
		<div className={styles.profile}>
			<h2 className={styles.profile__title}>Профиль</h2>
			<div className={styles.loaderWrapper}>
				<div className={styles.loader} />
				<p className={styles.loaderText}>Загружаем данные профиля…</p>
			</div>
		</div>
	)
}
