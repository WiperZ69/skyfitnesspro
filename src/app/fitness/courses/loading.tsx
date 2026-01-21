import styles from './CoursesPage.module.scss'

export default function CoursesLoading() {
	return (
		<main className={styles.main}>
			<div className={styles.main__heading}>
				<h3 className={styles.main__title}>
					Начните заниматься спортом и&nbsp;улучшите качество жизни
				</h3>
				<div className={styles.main__description}>
					Измени своё тело за полгода!
				</div>
			</div>

			<div className={styles.loaderWrapper}>
				<div className={styles.loader} />
				<p className={styles.loaderText}>Загружаем курсы…</p>
			</div>
		</main>
	)
}
