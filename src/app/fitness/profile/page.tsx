'use client'

import { logout } from '@/store/features/authSlice'
import { fetchCourseProgress } from '@/store/features/progressSlice'
import { fetchWorkout } from '@/store/features/workoutSlice'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import Image from 'next/image'
import styles from './UserProfile.module.scss'

import CourseUniversalCard from '@/components/CourseUniversalCard/CourseUniversalCard'
import TrainingsModal from '@/components/modal/TrainingsModal'
import type { Course, Workout } from '@/lib/types'
import { fetchCourses } from '@/store/features/OLDcoursesSlice'

export default function UserProfile() {
	const dispatch = useAppDispatch()
	const router = useRouter()

	const { user } = useAppSelector(state => state.auth)
	const { courses } = useAppSelector(state => state.courses)
	const { courseProgress } = useAppSelector(state => state.progress)

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalTitle, setModalTitle] = useState('')
	const [currentWorkouts, setCurrentWorkouts] = useState<Workout[]>([])
	const [modalLoading, setModalLoading] = useState(false)
	const [currentCourseId, setCurrentCourseId] = useState<string | null>(null)

	const token = user.token

	console.log(user)

	useEffect(() => {
		if (!token) return
		dispatch(fetchCourses(token))
	}, [token, dispatch])

	// Фильтруем курсы выбранные пользователем
	const selectedCourses = useMemo(() => {
		return user?.selectedCourses
			? courses.filter(c => user.selectedCourses.includes(c._id))
			: []
	}, [user?.selectedCourses, courses])

	// Загружаем прогресс по каждому курсу
	useEffect(() => {
		if (!token) return
		if (!user?.selectedCourses) return

		const userCourseIds = user.selectedCourses

		userCourseIds.forEach(courseId => {
			dispatch(fetchCourseProgress({ courseId, token }))
		})
	}, [token, user?.selectedCourses, dispatch])

	const handleOpenTrainings = async (course: Course) => {
		if (!token) return
		setCurrentCourseId(course._id)
		setModalTitle(course.nameRU)
		setIsModalOpen(true)
		setModalLoading(true)

		try {
			const uniqueWorkoutIds = Array.from(new Set(course.workouts))

			const workoutsData = await Promise.all(
				uniqueWorkoutIds.map(workoutId =>
					dispatch(fetchWorkout({ workoutId, token })).unwrap()
				)
			)

			setCurrentWorkouts(workoutsData)
		} catch {
			setCurrentWorkouts([])
		} finally {
			setModalLoading(false)
		}
	}

	const handleLogout = () => {
		dispatch(logout())
		router.push('/')
	}
	const progressForCurrentCourse = courseProgress?.find(
		p => p.courseId === currentCourseId
	)

	const workoutsProgressMap = progressForCurrentCourse
		? Object.fromEntries(
				progressForCurrentCourse.workoutsProgress.map(w => [
					w.workoutId,
					{ workoutCompleted: w.workoutCompleted },
				])
		  )
		: {}

	const handleResetProgress = async (courseId: string) => {
		if (!token) return

		try {
			const res = await fetch(`/api/fitness/courses/${courseId}/reset`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': '',
				},
			})

			if (!res.ok) throw new Error('Не удалось сбросить прогресс')

			alert('Прогресс курса удалён!')

			dispatch(fetchCourseProgress({ courseId, token }))
		} catch (err) {
			console.error(err)
			alert('Ошибка при сбросе прогресса')
		}
	}

	return (
		<div className={styles.profile}>
			<h2 className={styles.profile__title}>Профиль</h2>

			<div className={styles.profile__card}>
				<div className={styles.profile__info}>
					<div className={styles.profile__avatar}>
						<Image
							src='/avatar.svg'
							alt='Avatar'
							fill
							className={styles.avatar_image}
							loading='eager'
						/>
					</div>

					<div className={styles.profile__details}>
						<div className={styles.profile__login}>
							<p className={styles.profile__label}>Логин:</p>
							<p className={styles.profile__email}>{user?.email}</p>
						</div>

						<button className={styles.logoutBtn} onClick={handleLogout}>
							Выйти
						</button>
					</div>
				</div>
			</div>

			<h2 className={styles.section_title}>Мои курсы</h2>

			<div className={styles.courses_list}>
				{selectedCourses.map(course => {
					const progressForCourse = (courseProgress ?? []).find(
						p => p.courseId === course._id
					)

					let percent = 0

					if (progressForCourse) {
						const completed = (progressForCourse.workoutsProgress ?? []).filter(
							w => w.workoutCompleted
						).length

						const total = course.workouts.length

						if (total > 0) {
							percent = Math.round((completed / total) * 100)
						}
					}

					return (
						<CourseUniversalCard
							key={course._id}
							course={course}
							progress={percent}
							onResetProgress={() => handleResetProgress(course._id)}
							onOpenTrainings={() => handleOpenTrainings(course)}
							showFavorite={false}
						/>
					)
				})}
			</div>

			<TrainingsModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={modalTitle}
				trainings={currentWorkouts}
				loading={modalLoading}
				courseProgress={workoutsProgressMap}
				courseId={currentCourseId ?? undefined}
			/>
		</div>
	)
}
