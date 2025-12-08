import Image from 'next/image'
import Link from 'next/link'
import styles from './not-found.module.scss'

export default function NotFound() {
	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<h1 className={styles.title}>404</h1>
				<h2 className={styles.text}>
					Страница не найдена{' '}
					<Image
						src={'/Image/crying.png'}
						alt='Смайлик'
						width={52}
						height={52}
					/>
				</h2>
				<p className={styles.description}>
					Возможно, она была удалена <br /> или перенесена на другой адрес
				</p>
				<Link href='/courses/' className={styles.link}>
					Вернуться на главную
				</Link>
			</div>
		</div>
	)
}
