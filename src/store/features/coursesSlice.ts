// import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// import { Course, CourseProgress, Workout, WorkoutProgress } from '@/lib/types'

// interface initialStoreState {
// 	allCourses: Course[] // все курсы
// 	allWorkouts: Workout[] // все тренировки
// 	currentCourse: null | CourseProgress // текущий курс
// 	currentWorkout: null | WorkoutProgress // текущая тренировка
// }

// const initialState: initialStoreState = {
// 	allCourses: [],
// 	allWorkouts: [],
// 	currentCourse: null,
// 	currentWorkout: null,
// }

// export const coursesSlice = createSlice({
// 	name: 'courses',
// 	initialState,
// 	reducers: {
// 		setAllCourses: (state, action: PayloadAction<Course[]>) => {
// 			state.allCourses = action.payload
// 		},

// 		setAllWorkouts: (state, action: PayloadAction<Workout[]>) => {
// 			state.allWorkouts = action.payload
// 		},

// 		setCurrentCourse: (state, action: PayloadAction<null | CourseProgress>) => {
// 			state.currentCourse = action.payload
// 		},

// 		setCurrentWorkout: (
// 			state,
// 			action: PayloadAction<null | WorkoutProgress>
// 		) => {
// 			state.currentWorkout = action.payload
// 		},
// 	},
// })

// export const {
// 	setAllCourses,
// 	setAllWorkouts,
// 	setCurrentCourse,
// 	setCurrentWorkout,
// } = coursesSlice.actions

// export const coursesSliceReducer = coursesSlice.reducer
