'use client'

import { restoreSession } from '@/store/features/authSlice'
import { useAppDispatch } from '@/store/store'
import { useEffect } from 'react'

export default function InitAuth() {
	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(restoreSession())
	}, [dispatch])

	return null
}
