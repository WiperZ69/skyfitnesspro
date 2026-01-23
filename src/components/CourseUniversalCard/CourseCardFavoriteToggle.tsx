'use client'

import { addCourse, removeCourse } from '@/store/features/userCoursesSlice'
import { useAppDispatch, useAppSelector } from '@/store/store'
import styles from './CourseUniversalCard.module.scss'

type Props = {
	courseId: string
}

export function CourseCardFavoriteToggle({ courseId }: Props) {
	const dispatch = useAppDispatch()
	const { user, isAuthenticated } = useAppSelector(state => state.auth)

	const alreadySelected = user?.selectedCourses?.includes(courseId)

	const handleToggle = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()

		if (!isAuthenticated) {
			alert('Авторизуйтесь, чтобы добавлять курсы')
			return
		}

		if (alreadySelected) {
			dispatch(removeCourse(courseId))
		} else {
			dispatch(addCourse(courseId))
		}
	}

	return (
		<div
			className={styles.favorite}
			title={alreadySelected ? 'Удалить курс' : 'Добавить курс'}
			onClick={handleToggle}
		>
			{alreadySelected ? (
				<svg width='27' height='27' viewBox='0 0 27 27' fill='none'>
					<path
						fillRule='evenodd'
						clipRule='evenodd'
						d='M13.3333 26.6667C20.6971 26.6667 26.6667 20.6971 26.6667 13.3333C26.6667 5.96954 20.6971 0 13.3333 0C5.96954 0 0 5.96954 0 13.3333C0 20.6971 5.96954 26.6667 13.3333 26.6667ZM6.66667 12H20V14.6667H6.66667V12Z'
						fill='white'
					/>
				</svg>
			) : (
				<svg width='27' height='27' viewBox='0 0 27 27' fill='none'>
					<path
						fillRule='evenodd'
						clipRule='evenodd'
						d='M13.3333 26.6667C20.6971 26.6667 26.6667 20.6971 26.6667 13.3333C26.6667 5.96954 20.6971 0 13.3333 0C5.96954 0 0 5.96954 0 13.3333C0 20.6971 5.96954 26.6667 13.3333 26.6667ZM12 12V6.66667H14.6667V12H20V14.6667H14.6667V20H12V14.6667H6.66667V12H12Z'
						fill='white'
					/>
				</svg>
			)}
		</div>
	)
}
