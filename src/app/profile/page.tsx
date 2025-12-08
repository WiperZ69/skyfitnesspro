'use client'

import { logout } from '@/store/features/authSlice'
import { fetchCourses } from '@/store/features/coursesSlice'
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

export default function UserProfile() {
	const dispatch = useAppDispatch()
	const router = useRouter()

	const { user, token } = useAppSelector(state => state.auth)
	const { courses, loading: coursesLoading } = useAppSelector(
		state => state.courses
	)
	const { courseProgress } = useAppSelector(state => state.progress)
	const workoutState = useAppSelector(state => state.workout)

	// --- Modal Local State ---
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalTitle, setModalTitle] = useState('')
	const [currentWorkouts, setCurrentWorkouts] = useState<Workout[]>([])
	const [modalLoading, setModalLoading] = useState(false)

	// Загружаем курсы один раз
	useEffect(() => {
		if (token && courses.length === 0) {
			dispatch(fetchCourses(token))
		}
	}, [token, courses.length, dispatch])

	// Фильтруем курсы выбранные пользователем
	const selectedCourses = useMemo(() => {
		return user?.selectedCourses
			? courses.filter(c => user.selectedCourses.includes(c._id))
			: []
	}, [user?.selectedCourses, courses])

	console.log(selectedCourses)

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
		setModalTitle(course.nameRU)
		setIsModalOpen(true)
		setModalLoading(true)

		try {
			const uniqueWorkoutIds = Array.from(new Set(course.workouts))

			const workoutsData: Workout[] = []

			for (const workoutId of uniqueWorkoutIds) {
				const res = await dispatch(fetchWorkout({ workoutId, token })).unwrap()
				workoutsData.push(res)
			}

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
					const progressForCourse =
						courseProgress?.find(p => p.workoutId === course._id) || null

					let percent = 0
					if (progressForCourse) {
						const completed = progressForCourse.workoutCompleted ? 1 : 0
						percent = completed * 100
					}

					return (
						<CourseUniversalCard
							key={course._id}
							course={course}
							progress={percent}
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
			/>
		</div>
	)
}
