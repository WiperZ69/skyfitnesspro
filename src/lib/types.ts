export interface User {
	email: string
	selectedCourses: string[]
}

export interface Course {
	_id: string
	nameRU: string
	nameEN: string
	description: string
	difficulty?: string
	durationInDays?: number
	dailyDurationInMinutes?: { from: number; to: number }
	workouts: string[]
}

export interface Workout {
	_id: string
	name: string
	video: string
	exercises: {
		name: string
		quantity: number
		_id: string
	}[]
}

export interface ProgressWorkout {
	workoutId: string
	workoutCompleted: boolean
	progressData: number[]
}
