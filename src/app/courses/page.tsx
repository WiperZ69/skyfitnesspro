import CourseUniversalCard from '@/components/CourseUniversalCard/CourseUniversalCard'
import { BASE_API_URL, ROUTE_API_URL } from '@/lib/constants'
import { Course } from '@/types/fitness'
import { cookies } from 'next/headers'
import styles from './CoursesPage.module.scss'

export default async function CoursesPage() {
	const token = (await cookies()).get('token')?.value

	const res = await fetch(BASE_API_URL + ROUTE_API_URL.courses, {
		headers: token ? { Authorization: `Bearer ${token}` } : {},
		cache: 'force-cache',
	})

	if (!res.ok) {
		throw new Error('Ошибка загрузки курсов')
	}

	const courses = res.ok ? await res.json() : []

	return (
		<div>
			<main className={styles.main}>
				<div className={styles.main__heading}>
					<h3 className={styles.main__title}>
						Начните заниматься спортом и&nbsp;улучшите качество жизни
					</h3>
					<div className={styles.main__description}>
						Измени своё тело за полгода!
					</div>
				</div>
				<section className={styles.courses}>
					{courses.map((course: Course) => (
						<CourseUniversalCard
							key={course._id}
							course={course}
							showFavorite={true}
						/>
					))}
				</section>
			</main>
		</div>
	)
}
