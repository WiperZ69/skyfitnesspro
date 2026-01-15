import { BASE_API_URL, ROUTE_API_URL } from '@/lib/constants'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store'
import { setSelectedCourses, updateSelectedCourses } from './authSlice'

export const addCourse = createAsyncThunk<
	string,
	string,
	{ state: RootState; rejectValue: string }
>(
	'userCourses/addCourse',
	async (courseId, { getState, dispatch, rejectWithValue }) => {
		try {
			const token = getState().auth.user.token
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

			// Обновляем selectedCourses в authSlice
			dispatch(updateSelectedCourses(courseId))

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
			const token = getState().auth.user.token // Исправлено: было getState().auth.token
			if (!token) return rejectWithValue('Нет токена')

			const url = `${BASE_API_URL}${ROUTE_API_URL.addUserCourse}/${courseId}`

			await axios.delete(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			// Обновляем selectedCourses в authSlice
			// Используем тот же action, так как он toggle логику
			dispatch(updateSelectedCourses(courseId))

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

// Дополнительный thunk для получения выбранных курсов
export const fetchUserCourses = createAsyncThunk<
	string[],
	void,
	{ state: RootState; rejectValue: string }
>(
	'userCourses/fetchCourses',
	async (_, { getState, dispatch, rejectWithValue }) => {
		try {
			const token = getState().auth.user.token
			if (!token) return rejectWithValue('Нет токена')

			const url = `${BASE_API_URL}${ROUTE_API_URL.addUserCourse}`

			const res = await axios.get(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			// Предполагаем, что API возвращает массив courseIds
			const courses = res.data.courses || res.data || []
			dispatch(setSelectedCourses(courses))

			return courses
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
	reducers: {
		clearError: state => {
			state.error = null
		},
	},
	extraReducers: builder => {
		builder
			// addCourse
			.addCase(addCourse.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(addCourse.fulfilled, state => {
				state.loading = false
			})
			.addCase(addCourse.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload as string
			})

			// removeCourse
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

			// fetchUserCourses
			.addCase(fetchUserCourses.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(fetchUserCourses.fulfilled, state => {
				state.loading = false
			})
			.addCase(fetchUserCourses.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload as string
			})
	},
})

export const { clearError } = userCoursesSlice.actions
export const userCoursesReducer = userCoursesSlice.reducer
