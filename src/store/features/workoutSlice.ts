import { BASE_API_URL } from '@/lib/constants'
import { Workout } from '@/lib/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

type WorkoutState = {
	workout: Workout | null
	loading: boolean
	error: string | null
}

const initialState: WorkoutState = {
	workout: null,
	loading: false,
	error: null,
}

export const fetchWorkout = createAsyncThunk(
	'workout/fetchOne',
	async ({ workoutId, token }: { workoutId: string; token: string }) => {
		const res = await fetch(`${BASE_API_URL}/workouts/${workoutId}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		if (!res.ok) throw new Error('Не удалось загрузить тренировку')

		return (await res.json()) as Workout
	}
)

const workoutSlice = createSlice({
	name: 'workout',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchWorkout.pending, state => {
				state.loading = true
				state.error = null
			})
			.addCase(fetchWorkout.fulfilled, (state, action) => {
				state.loading = false
				state.workout = action.payload
			})
			.addCase(fetchWorkout.rejected, (state, action) => {
				state.loading = false
				state.error = action.error.message || 'Ошибка'
			})
	},
})

export const workoutReducer = workoutSlice.reducer
