import { CourseProgressInterface } from '@/sharedInterfaces/sharedInterfaces'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface initialState {
	isAuthenticated: boolean
  isLoading: boolean
	user: {
		email: string
		token: string
		selectedCourses: string[]
		courseProgress: CourseProgressInterface[]
	}
}

const initialState: initialState = {
	isAuthenticated: false,
	user: {
		email: '',
		token: '',
		selectedCourses: [],
		courseProgress: [],
	},
}

export const authSlice = createSlice({
	name: 'authentication',
	initialState,
	reducers: {
		setisSignUp: (state, action: PayloadAction<boolean>) => {
			state.isAuthenticated = action.payload
		},

		setUserId: (state, action: PayloadAction<string>) => {
			state.user.userId = action.payload
			localStorage.setItem('userId', action.payload)
		},

		setStorageLogin: (state, action: PayloadAction<string>) => {
			state.user.email = action.payload
			localStorage.setItem('email', action.payload)
		},

		setStorageToken: (state, action: PayloadAction<string>) => {
			state.user.token = action.payload
			localStorage.setItem('token', action.payload)
		},

		clearStorageTokens: state => {
			state.user.userId = ''
			state.user.email = ''
			state.user.token = ''

			localStorage.removeItem('userId')
			localStorage.removeItem('email')
			localStorage.removeItem('token')
		},

		setSelectedCourses: (state, action: PayloadAction<string[]>) => {
			state.user.selectedCourses = action.payload
		},

		setCourseProgress: (
			state,
			action: PayloadAction<CourseProgressInterface[]>
		) => {
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
	},
})

export const {
	setisSignUp,
	setUserId,
	setStorageLogin,
	setStorageToken,
	clearStorageTokens,
	setSelectedCourses,
	setCourseProgress,
	updateSelectedCourses,
} = authSlice.actions

export const authSliceSliceReducer = authSlice.reducer
