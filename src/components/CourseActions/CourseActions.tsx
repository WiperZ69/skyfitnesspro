'use client'

import { openAuthModal } from '@/store/features/uiSlice'
import { addCourse, removeCourse } from '@/store/features/userCoursesSlice'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { useEffect, useMemo, useRef } from 'react'
import { toast } from 'react-toastify'
import styles from './CourseActions.module.scss'

type Props = {
	courseId: string
}

export default function CourseActions({ courseId }: Props) {
	const dispatch = useAppDispatch()
	const { user, isAuthenticated } = useAppSelector(state => state.auth)
	const userCoursesLoading = useAppSelector(state => state.userCourses.loading)
	const userCoursesError = useAppSelector(state => state.userCourses.error)
	const prevIsAddedRef = useRef<boolean | null>(null)

	const isAdded = useMemo(() => {
		if (!user) return false
		return (user.selectedCourses || []).includes(courseId)
	}, [user, courseId])

	// Отслеживаем успешное добавление/удаление курса
	useEffect(() => {
		if (prevIsAddedRef.current === null) {
			prevIsAddedRef.current = isAdded
			return
		}

		if (prevIsAddedRef.current !== isAdded && !userCoursesLoading) {
			if (isAdded) {
				toast.success('Курс успешно добавлен!')
			} else {
				toast.success('Курс успешно удален!')
			}
		}

		prevIsAddedRef.current = isAdded
	}, [isAdded, userCoursesLoading])

	const handleAdd = () => {
		if (!isAuthenticated) {
			dispatch(openAuthModal('login'))
			return
		}
		dispatch(addCourse(courseId))
	}

	const handleRemove = () => {
		if (!isAuthenticated) {
			dispatch(openAuthModal('login'))
			return
		}
		dispatch(removeCourse(courseId))
	}

	if (!isAuthenticated) {
		return (
			<button
				className={styles.ctaBtn}
				onClick={() => dispatch(openAuthModal('login'))}
			>
				Войдите, чтобы добавить курс
			</button>
		)
	}

	return (
		<div>
			{isAdded ? (
				<button
					className={styles.ctaBtn}
					onClick={handleRemove}
					disabled={userCoursesLoading}
				>
					{userCoursesLoading ? 'Секунда...' : 'Удалить курс'}
				</button>
			) : (
				<button
					className={styles.ctaBtn}
					onClick={handleAdd}
					disabled={userCoursesLoading}
				>
					{userCoursesLoading ? 'Секунда...' : 'Добавить курс'}
				</button>
			)}

			{userCoursesError && (
				<div className={styles.error}>{userCoursesError}</div>
			)}
		</div>
	)
}
