// store/features/userCoursesSlice.ts
import { BASE_API_URL, ROUTE_API_URL } from '@/lib/constants'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store'
import { setCredentials } from './authSlice'

export const addCourse = createAsyncThunk<
	string,
	string,
	{ state: RootState; rejectValue: string }
>(
	'userCourses/addCourse',
	async (courseId, { getState, dispatch, rejectWithValue }) => {
		try {
			const token = getState().auth.token
			if (!token) return rejectWithValue('Нет токена')

			const url = `${BASE_API_URL}${ROUTE_API_URL.addUserCourse}`

			const res = await axios.post(
				url,
				{ courseId },
				{
					headers: {
						'Content-Type': '',
						Authorization: `Bearer ${token}`,
					},
				}
			)

			// обновляем user в auth
			const user = getState().auth.user
			if (user) {
				const updatedUser = {
					...user,
					selectedCourses: Array.from(
						new Set([...(user.selectedCourses || []), courseId])
					),
				}
				dispatch(setCredentials({ user: updatedUser, token }))
			}

			return courseId
		} catch (error: any) {
			return rejectWithValue(
				error?.response?.data?.message ||
					error?.response?.data?.error ||
					error.message
			)
		}
	}
)

export const removeCourse = createAsyncThunk<
	string,
	string,
	{ state: RootState; rejectValue: string }
>(
	'userCourses/removeCourse',
	async (courseId, { getState, dispatch, rejectWithValue }) => {
		try {
			const token = getState().auth.token
			if (!token) return rejectWithValue('Нет токена')

			const url = `${BASE_API_URL}${ROUTE_API_URL.addUserCourse}/${courseId}`

			await axios.delete(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			// обновляем auth
			const user = getState().auth.user
			if (user) {
				const updatedUser = {
					...user,
					selectedCourses: (user.selectedCourses || []).filter(
						id => id !== courseId
					),
				}
				dispatch(setCredentials({ user: updatedUser, token }))
			}

			return courseId
		} catch (error: any) {
			return rejectWithValue(
				error?.response?.data?.message ||
					error?.response?.data?.error ||
					error.message
			)
		}
	}
)

type UserCoursesState = {
	loading: boolean
	error: string | null
}

const initialState: UserCoursesState = {
	loading: false,
	error: null,
}

const userCoursesSlice = createSlice({
	name: 'userCourses',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(addCourse.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(addCourse.fulfilled, (state /*, action */) => {
				state.loading = false
			})
			.addCase(addCourse.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload as string
			})

			.addCase(removeCourse.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(removeCourse.fulfilled, state => {
				state.loading = false
			})
			.addCase(removeCourse.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload as string
			})
	},
})

export const userCoursesReducer = userCoursesSlice.reducer
