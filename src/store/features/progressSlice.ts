import { BASE_API_URL, ROUTE_API_URL } from '@/lib/constants'
import { ProgressWorkout } from '@/lib/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

type ProgressState = {
	courseProgress: ProgressWorkout[] | null
	workoutProgress: ProgressWorkout | null
	loading: boolean
	error: string | null
}

const initialState: ProgressState = {
	courseProgress: null,
	workoutProgress: null,
	loading: false,
	error: null,
}

export const fetchCourseProgress = createAsyncThunk(
	'progress/fetchCourse',
	async ({ courseId, token }: { courseId: string; token: string }) => {
		const url = new URL(`${BASE_API_URL}${ROUTE_API_URL.getCourseProgress}`)
		url.searchParams.set('courseId', courseId)

		const res = await fetch(url.toString(), {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (!res.ok) throw new Error('Не удалось загрузить прогресс')

		return await res.json()
	}
)

const progressSlice = createSlice({
	name: 'progress',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchCourseProgress.pending, s => {
				s.loading = true
				s.error = null
			})
			.addCase(fetchCourseProgress.fulfilled, (s, action) => {
				s.loading = false
				s.courseProgress = action.payload.workoutsProgress
			})
			.addCase(fetchCourseProgress.rejected, (s, action) => {
				s.loading = false
				s.error = action.error.message || 'Ошибка'
			})
	},
})

export const progressReducer = progressSlice.reducer
