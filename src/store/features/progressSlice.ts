import { BASE_API_URL, ROUTE_API_URL } from '@/lib/constants'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export type WorkoutProgress = {
	workoutId: string
	workoutCompleted: boolean
	progressData: number[]
}

export type CourseProgress = {
	courseId: string
	courseCompleted: boolean
	workoutsProgress: WorkoutProgress[]
}

type ProgressState = {
	courseProgress: CourseProgress[]
	workoutProgress: WorkoutProgress | null
	loading: boolean
	error: string | null
}

const initialState: ProgressState = {
	courseProgress: [],
	workoutProgress: null,
	loading: false,
	error: null,
}

export const fetchCourseProgress = createAsyncThunk<
	CourseProgress,
	{ courseId: string; token: string }
>('progress/fetchCourse', async ({ courseId, token }) => {
	const url = new URL(`${BASE_API_URL}${ROUTE_API_URL.getCourseProgress}`)
	url.searchParams.set('courseId', courseId)

	const res = await fetch(url.toString(), {
		headers: { Authorization: `Bearer ${token}` },
	})

	if (!res.ok) {
		throw new Error('Не удалось загрузить прогресс курса')
	}

	return (await res.json()) as CourseProgress
})

export const fetchWorkoutProgress = createAsyncThunk(
	'progress/fetchWorkout',
	async ({
		courseId,
		workoutId,
		token,
	}: {
		courseId: string
		workoutId: string
		token: string
	}) => {
		const url = new URL(`${BASE_API_URL}${ROUTE_API_URL.getCourseProgress}`)
		url.searchParams.set('courseId', courseId)
		url.searchParams.set('workoutId', workoutId)

		try {
			const res = await fetch(url.toString(), {
				headers: { Authorization: `Bearer ${token}` },
			})

			if (!res.ok) {
				throw new Error('Не удалось загрузить прогресс тренировки')
			}

			return (await res.json()) as WorkoutProgress
		} catch {
			throw new Error('Не удалось загрузить прогресс тренировки')
		}
	}
)

const progressSlice = createSlice({
	name: 'progress',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder

			.addCase(fetchCourseProgress.pending, state => {
				state.loading = true
				state.error = null
			})

			.addCase(fetchCourseProgress.fulfilled, (state, action) => {
				state.loading = false

				const progress = action.payload

				const idx = state.courseProgress.findIndex(
					p => p.courseId === progress.courseId
				)

				if (idx !== -1) {
					state.courseProgress[idx] = progress
				} else {
					state.courseProgress.push(progress)
				}
			})

			.addCase(fetchCourseProgress.rejected, (state, action) => {
				state.loading = false
				state.error = action.error.message || 'Ошибка'
			})

			.addCase(fetchWorkoutProgress.pending, state => {
				state.loading = true
				state.error = null
			})

			.addCase(fetchWorkoutProgress.fulfilled, (state, action) => {
				state.loading = false
				state.workoutProgress = action.payload
			})

			.addCase(fetchWorkoutProgress.rejected, (state, action) => {
				state.loading = false
				state.error = action.error.message || 'Ошибка'
			})
	},
})

export const progressReducer = progressSlice.reducer
