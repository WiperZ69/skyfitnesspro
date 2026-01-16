'use client'

import { calcPercent } from '@/app/utils/calcPercent'
import { BASE_API_URL } from '@/lib/constants'
import type { Workout as BaseWorkout } from '@/lib/types'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import styles from './WorkoutPage.module.scss'

interface Workout extends BaseWorkout {
	description?: string
	progressData?: number[]
	courseId?: string
}

type Props = {
	workout: Workout
}

export function WorkoutClient({ workout }: Props) {
	const searchParams = useSearchParams()

	const [progress, setProgress] = useState<number[]>(
		workout.progressData && workout.progressData.length
			? workout.progressData
			: new Array(workout.exercises.length).fill(0)
	)
	const [modalOpen, setModalOpen] = useState(false)

	const workoutId = workout._id
	const courseId = workout.courseId || searchParams.get('courseId')

	function updateExerciseProgress(index: number, newValue: number) {
		setProgress(prev => prev.map((p, i) => (i === index ? newValue : p)))
	}

	async function saveProgress() {
		const token = localStorage.getItem('token')
		if (!token || !courseId || !workoutId) return

		await fetch(`${BASE_API_URL}/courses/${courseId}/workouts/${workoutId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ progressData: progress }),
		})
	}

	return (
		<div className={styles.page}>
			<h1 className={styles.title}>{workout.name}</h1>

			<div className={styles.videoWrapper}>
				<iframe
					className={styles.video}
					src={workout.video}
					title='Workout video'
					allowFullScreen
				/>
			</div>

			<div className={styles.card}>
				<h2 className={styles.subtitle}>Упражнения тренировки</h2>

				<div className={styles.grid}>
					{workout.exercises.map((ex, i) => {
						const percent = calcPercent(progress[i], ex.quantity)

						return (
							<div key={ex._id} className={styles.exercise}>
								<p className={styles.exerciseTitle}>
									{ex.name} — {percent}%
								</p>

								<div className={styles.progressLine}>
									<div
										className={styles.progressInner}
										style={{ width: `${percent}%` }}
									/>
								</div>
							</div>
						)
					})}
				</div>

				<button
					className={styles.button}
					onClick={() => {
						setModalOpen(true)
					}}
				>
					Заполнить свой прогресс
				</button>
				{modalOpen && (
					<div className={styles.container} onClick={() => setModalOpen(false)}>
						<div className={styles.modal} onClick={e => e.stopPropagation()}>
							<div className={styles.modalContent}>
								<h2 className={styles.modal__title}>Мой прогресс</h2>
								<div className={styles.exercises}>
									{workout.exercises.map((ex, i) => {
										return (
											<div key={ex._id} className={styles.exercise}>
												<p className={styles.modal__text}>
													Сколько раз вы сделали {ex.name}?
												</p>
												<input
													className={styles.modal__input}
													type='number'
													min={0}
													max={ex.quantity}
													value={progress[i]}
													onChange={e =>
														updateExerciseProgress(i, Number(e.target.value))
													}
												/>
											</div>
										)
									})}
								</div>

								<button
									className={styles.button}
									style={{ width: '100%' }}
									onClick={saveProgress}
								>
									Сохранить
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

