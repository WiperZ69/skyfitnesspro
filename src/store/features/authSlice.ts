import { CourseProgress } from '@/lib/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
	isAuthenticated: boolean
	isLoading: boolean
	user: {
		email: string
		token: string
		selectedCourses: string[]
		courseProgress: CourseProgress[]
	}
}

const initialState: AuthState = {
	isAuthenticated: false,
	isLoading: true,
	user: {
		email: '',
		token: '',
		selectedCourses: [],
		courseProgress: [],
	},
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
			state.isAuthenticated = action.payload
		},
		setStorageLogin: (state, action: PayloadAction<string>) => {
			state.user.email = action.payload
			localStorage.setItem('email', action.payload)
		},

		setStorageToken: (state, action: PayloadAction<string>) => {
			state.user.token = action.payload
			localStorage.setItem('token', action.payload)
		},

		logout: state => {
			state.user.email = ''
			state.user.token = ''
			state.isAuthenticated = false

			localStorage.removeItem('email')
			localStorage.removeItem('token')
		},

		setSelectedCourses: (state, action: PayloadAction<string[]>) => {
			state.user.selectedCourses = action.payload
		},

		setCourseProgress: (state, action: PayloadAction<CourseProgress[]>) => {
			state.user.courseProgress = action.payload
		},

		updateSelectedCourses: (state, action: PayloadAction<string>) => {
			const selectedCourses = state.user.selectedCourses
			if (selectedCourses.includes(action.payload)) {
				state.user.selectedCourses = selectedCourses.filter(
					courseId => courseId !== action.payload
				)
			} else {
				state.user.selectedCourses.push(action.payload)
			}
		},

		restoreSession: state => {
			if (typeof window !== 'undefined') {
				const token = localStorage.getItem('token')
				const email = localStorage.getItem('email')

				if (token && email) {
					state.user.token = token
					state.user.email = email
					state.isAuthenticated = true
				}
			}

			state.isLoading = false
		},
	},
})

export const {
	logout,
	setCourseProgress,
	setIsAuthenticated,
	setSelectedCourses,
	setStorageLogin,
	setStorageToken,
	updateSelectedCourses,
	restoreSession,
} = authSlice.actions
export const authReducer = authSlice.reducer
