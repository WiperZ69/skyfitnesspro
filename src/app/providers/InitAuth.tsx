'use client'

import {
	restoreSession,
	setCourseProgress,
	setSelectedCourses,
} from '@/store/features/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { useEffect } from 'react'
import { getUser } from '../services/auth/authApi'

export default function InitAuth() {
	const dispatch = useAppDispatch()
	const { user, isAuthenticated } = useAppSelector(state => state.auth)

	useEffect(() => {
		dispatch(restoreSession())
		if (!isAuthenticated || !user.token) return
		const UpdatedUser = async () => {
			try {
				const userData = await getUser(user.token)
				if (userData) {
					dispatch(setSelectedCourses(userData.user.selectedCourses))
					dispatch(setCourseProgress(userData.user.courseProgress))
				}
			} catch (error) {
				if (error instanceof Error) {
					console.error(error.message)
				} else {
					console.error(error)
				}
			}
		}
		UpdatedUser()
	}, [dispatch, isAuthenticated])

	return null
}
