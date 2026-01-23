'use client'

import { calcPercent } from '@/app/utils/calcPercent'
import { BASE_API_URL } from '@/lib/constants'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './WorkoutPage.module.scss'

interface WorkoutExercise {
	_id: string
	name: string
	quantity: number
}

interface Workout {
	_id: string
	name: string
	description: string
	video: string
	exercises: WorkoutExercise[]
	progressData?: number[]
	courseId?: string
}

export default function WorkoutPage() {
	const searchParams = useSearchParams()
	const workoutId = searchParams.get('workoutId')

	const [workout, setWorkout] = useState<Workout | null>(null)
	const [loading, setLoading] = useState(true)
	const [progress, setProgress] = useState<string[]>([])
	const [modalOpen, setModalOpen] = useState(false)

	async function saveProgress() {
		const token = localStorage.getItem('token')
		const courseId = workout?.courseId || searchParams.get('courseId')

		if (!token || !courseId || !workoutId) {
			console.error('Нет token / courseId / workoutId')
			return
		}

		const res = await fetch(
			`${BASE_API_URL}/courses/${courseId}/workouts/${workoutId}`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': '',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					progressData: progress.map(v => Number(v) || 0),
				}),
			}
		)

		if (!res.ok) {
			const text = await res.text()
			console.error('Не удалось сохранить прогресс', res.status, text)
			return
		}

		setModalOpen(false)
	}

	useEffect(() => {
		if (!workoutId) return

		async function loadWorkout() {
			try {
				const token = localStorage.getItem('token')

				const res = await fetch(`${BASE_API_URL}/workouts/${workoutId}`, {
					headers: token ? { Authorization: `Bearer ${token}` } : {},
				})

				if (!res.ok) {
					console.error('Не удалось загрузить тренировку', res.status)
					setWorkout(null)
					return
				}

				const data = await res.json()
				setWorkout(data)
			} catch (e) {
				console.error(e)
				setWorkout(null)
			} finally {
				setLoading(false)
			}
		}

		loadWorkout()
	}, [workoutId])

	useEffect(() => {
		if (workout) {
			if (workout.progressData?.length) {
				setProgress(workout.progressData.map(v => String(v)))
			} else {
				setProgress(new Array(workout.exercises.length).fill(''))
			}
		}
	}, [workout])

	function updateExerciseProgress(index: number, value: string) {
		setProgress(prev => prev.map((p, i) => (i === index ? value : p)))
	}

	if (!workoutId) return <p className={styles.status}>Нет ID тренировки</p>
	if (loading) return <p className={styles.status}>Загрузка…</p>
	if (!workout)
		return <p className={styles.status}>Не удалось загрузить тренировку</p>

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
					Заполнить мой прогресс
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
													placeholder='0'
													value={progress[i]}
													onChange={e => {
														const value = e.target.value
														if (+value < 0) return
														if (+value > ex.quantity) {
															updateExerciseProgress(i, String(ex.quantity))
															return
														}
														updateExerciseProgress(i, value)
													}}
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
