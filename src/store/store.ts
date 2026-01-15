import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
	TypedUseSelectorHook,
	useDispatch,
	useSelector,
	useStore,
} from 'react-redux'
import { authReducer } from './features/authSlice'
import { coursesReducer } from './features/OLDcoursesSlice'
import { progressReducer } from './features/progressSlice'
import { uiReducer } from './features/uiSlice'
import { userCoursesReducer } from './features/userCoursesSlice'
import { workoutReducer } from './features/workoutSlice'

export const makeStore = () => {
	return configureStore({
		reducer: combineReducers({
			auth: authReducer,
			courses: coursesReducer,
			workout: workoutReducer,
			progress: progressReducer,
			ui: uiReducer,
			userCourses: userCoursesReducer,
		}),
	})
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppStore: () => AppStore = useStore
