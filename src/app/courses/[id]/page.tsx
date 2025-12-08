import CourseActions from '@/components/CourseActions/CourseActions'
import { BASE_API_URL, ROUTE_API_URL } from '@/lib/constants'
import Image from 'next/image'
import styles from './coursePage.module.scss'

export default async function CoursePage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	const res = await fetch(`${BASE_API_URL + ROUTE_API_URL.courses}/${id}`, {
		cache: 'no-store',
	})

	console.log(res)

	if (!res.ok) {
		return <div>Курс не найден</div>
	}

	const course = await res.json()

	return (
		<div className={styles.page}>
			<section className={styles.header}>
				<div className={styles.headerTitle}>{course.nameRU}</div>
				<Image
					src={`/${course.nameEN}.png`}
					alt={course.nameRU}
					fill
					className={styles.headerImage}
				/>
			</section>

			<section className={styles.fittingSection}>
				<h2>Подойдёт для вас, если:</h2>
				<div className={styles.fittingList}>
					{course.fitting.map((text: string, i: number) => (
						<div className={styles.fittingItem} key={i}>
							<div className={styles.fittingNumber}>{i + 1}</div>
							<p>{text}</p>
						</div>
					))}
				</div>
			</section>

			<section className={styles.directionsSection}>
				<h2>Направления</h2>
				<div className={styles.directionsList}>
					{course.directions.map((item: string, i: number) => (
						<div className={styles.direction} key={i}>
							<svg
								width='20'
								height='20'
								viewBox='0 0 20 20'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M9.21373 1.11751C9.3702 0.454433 9.44843 0.122896 9.57424 0.0482295C9.68259 -0.0160765 9.81741 -0.0160765 9.92576 0.0482295C10.0516 0.122896 10.1298 0.454434 10.2863 1.11751L11.0497 4.35302C11.3337 5.55636 11.4757 6.15803 11.7843 6.64596C12.0571 7.07744 12.4226 7.44285 12.854 7.71574C13.342 8.02432 13.9436 8.1663 15.147 8.45025L18.3825 9.21373C19.0456 9.3702 19.3771 9.44843 19.4518 9.57424C19.5161 9.68259 19.5161 9.81741 19.4518 9.92576C19.3771 10.0516 19.0456 10.1298 18.3825 10.2863L15.147 11.0497C13.9436 11.3337 13.342 11.4757 12.854 11.7843C12.4226 12.0571 12.0571 12.4226 11.7843 12.854C11.4757 13.342 11.3337 13.9436 11.0497 15.147L10.2863 18.3825C10.1298 19.0456 10.0516 19.3771 9.92576 19.4518C9.81741 19.5161 9.68259 19.5161 9.57424 19.4518C9.44843 19.3771 9.3702 19.0456 9.21373 18.3825L8.45025 15.147C8.1663 13.9436 8.02432 13.342 7.71574 12.854C7.44285 12.4226 7.07744 12.0571 6.64596 11.7843C6.15803 11.4757 5.55636 11.3337 4.35301 11.0497L1.11751 10.2863C0.454433 10.1298 0.122896 10.0516 0.0482295 9.92576C-0.0160765 9.81741 -0.0160765 9.68259 0.0482295 9.57424C0.122896 9.44843 0.454434 9.3702 1.11751 9.21373L4.35302 8.45025C5.55636 8.1663 6.15803 8.02432 6.64596 7.71574C7.07744 7.44285 7.44285 7.07744 7.71574 6.64596C8.02432 6.15803 8.1663 5.55636 8.45025 4.35301L9.21373 1.11751Z'
									fill='black'
								/>
							</svg>{' '}
							{item}
						</div>
					))}
				</div>
			</section>
			<section className={styles.cta}>
				<div className={styles.ctaText}>
					<h2>Начните путь к новому телу</h2>

					<ul>
						<li>проработка всех групп мышц</li>
						<li>тренировка суставов</li>
						<li>улучшение циркуляции крови</li>
						<li>упражнения заряжают бодростью</li>
						<li>помогают противостоять стрессам</li>
					</ul>

					<CourseActions courseId={id} />
				</div>

				<Image
					src='/course-man.png'
					alt='body'
					width={350}
					height={450}
					className={styles.ctaImage}
				/>
			</section>
		</div>
	)
}
