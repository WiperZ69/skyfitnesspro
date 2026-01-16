import { BASE_API_URL, ROUTE_API_URL } from '@/lib/constants'
import { Course } from '@/types/fitness'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

type CoursesState = {
	courses: Course[]
	loading: boolean
	error: string | null
}

const initialState: CoursesState = { courses: [], loading: false, error: null }

export const fetchCourses = createAsyncThunk<Course[], string>(
	'courses/fetchCourses',
	async (token, { rejectWithValue }) => {
		try {
			const res = await axios.get(`${BASE_API_URL}${ROUTE_API_URL.courses}`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			return res.data as Course[]
		} catch (err: unknown) {
			return rejectWithValue(
				err instanceof Error
					? err.message
					: 'Не удалось загрузить список курсов'
			)
		}
	}
)

const coursesSlice = createSlice({
	name: 'courses',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchCourses.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(fetchCourses.fulfilled, (state, action) => {
				state.loading = false
				state.courses = action.payload
			})
			.addCase(fetchCourses.rejected, (state, action) => {
				state.loading = false
				state.error = (action.payload as string) || 'Ошибка'
			})
	},
})

export const coursesReducer = coursesSlice.reducer
