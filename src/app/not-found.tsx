import Link from 'next/link'
import styles from './not-found.module.scss'

export default function NotFound() {
	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<h1 className={styles.title}>404</h1>
				<h2 className={styles.text}>Страница не найдена </h2>
				<p className={styles.description}>
					Возможно, она была удалена <br /> или перенесена на другой адрес
				</p>
				<Link href='fitness/courses/' className={styles.link}>
					Вернуться на главную
				</Link>
			</div>
		</div>
	)
}
