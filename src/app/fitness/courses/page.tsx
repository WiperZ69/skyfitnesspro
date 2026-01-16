import { CourseCardFavoriteToggle } from '@/components/CourseUniversalCard/CourseCardFavoriteToggle'
import cardStyles from '@/components/CourseUniversalCard/CourseUniversalCard.module.scss'
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
						<a
							key={course._id}
							href={`/fitness/courses/${course._id}`}
							className={cardStyles.card}
						>
							<div className={cardStyles.imageBlock}>
								<img
									src={`/${course.nameEN}.png`}
									alt={course.nameRU}
									className={cardStyles.image}
								/>
							</div>

							<div className={cardStyles.content}>
								<h3 className={cardStyles.title}>{course.nameRU}</h3>

								<div className={cardStyles.tags}>
									<div className={cardStyles.tag}>
										<svg
											width='18'
											height='18'
											viewBox='0 0 18 18'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<path
												d='M7.5 2.625C7.5 1.79657 6.82843 1.125 6 1.125C5.17157 1.125 4.5 1.79657 4.5 2.625C2.84315 2.625 1.5 3.96815 1.5 5.625H16.5C16.5 3.96815 15.1569 2.625 13.5 2.625C13.5 1.79657 12.8284 1.125 12 1.125C11.1716 1.125 10.5 1.79657 10.5 2.625H7.5Z'
												fill='#202020'
											/>
											<path
												fillRule='evenodd'
												clipRule='evenodd'
												d='M1.5 7.125H16.5V11.325C16.5 13.0052 16.5 13.8452 16.173 14.487C15.8854 15.0515 15.4265 15.5104 14.862 15.798C14.2202 16.125 13.3802 16.125 11.7 16.125H6.3C4.61984 16.125 3.77976 16.125 3.13803 15.798C2.57354 15.5104 2.1146 15.0515 1.82698 14.487C1.5 13.8452 1.5 13.0052 1.5 11.325V7.125ZM10.5 11.325C10.5 10.905 10.5 10.6949 10.5817 10.5345C10.6537 10.3934 10.7684 10.2787 10.9095 10.2067C11.0699 10.125 11.28 10.125 11.7 10.125H12.3C12.72 10.125 12.9301 10.125 13.0905 10.2067C13.2316 10.2787 13.3463 10.3934 13.4183 10.5345C13.5 10.6949 13.5 10.905 13.5 11.325V11.925C13.5 12.345 13.5 12.5551 13.4183 12.7155C13.3463 12.8566 13.2316 12.9713 13.0905 13.0433C12.9301 13.125 12.72 13.125 12.3 13.125H11.7C11.28 13.125 11.0699 13.125 10.9095 13.0433C10.7684 12.9713 10.6537 12.8566 10.5817 12.7155C10.5 12.5551 10.5 12.345 10.5 11.925V11.325Z'
												fill='#202020'
											/>
										</svg>
										{course.durationInDays} дней
									</div>
									{course.dailyDurationInMinutes && (
										<div className={cardStyles.tag}>
											<svg
												width='15'
												height='15'
												viewBox='0 0 15 15'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<path
													fillRule='evenodd'
													clipRule='evenodd'
													d='M7.5 15C11.6421 15 15 11.6421 15 7.5C15 3.35786 11.6421 0 7.5 0C3.35786 0 0 3.35786 0 7.5C0 11.6421 3.35786 15 7.5 15ZM6.75 3V7.5C6.75 7.91421 7.08579 8.25 7.5 8.25H11.25V6.75H8.25V3H6.75Z'
													fill='#202020'
												/>
											</svg>
											{course.dailyDurationInMinutes.from}–
											{course.dailyDurationInMinutes.to} мин/день
										</div>
									)}
								</div>

								<CourseCardFavoriteToggle courseId={course._id} />
							</div>
						</a>
					))}
				</section>
			</main>
		</div>
	)
}
