import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type User = {
	email: string
	selectedCourses: string[]
}

export type AuthState = {
	user: User | null
	token: string | null
	isAuthenticated: boolean
	isLoading: boolean
}

const initialState: AuthState = {
	user: null,
	token: null,
	isAuthenticated: false,
	isLoading: true,
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCredentials: (
			state,
			action: PayloadAction<{ user: User; token: string }>
		) => {
			state.user = action.payload.user
			state.token = action.payload.token
			state.isAuthenticated = true
			state.isLoading = false

			if (typeof window !== 'undefined') {
				localStorage.setItem('token', action.payload.token)
				localStorage.setItem('user', JSON.stringify(action.payload.user))
			}
		},

		logout: state => {
			state.user = null
			state.token = null
			state.isAuthenticated = false
			state.isLoading = false

			if (typeof window !== 'undefined') {
				localStorage.removeItem('token')
				localStorage.removeItem('user')
			}
		},

		restoreSession: state => {
			if (typeof window !== 'undefined') {
				const token = localStorage.getItem('token')
				const user = localStorage.getItem('user')

				if (token && user) {
					state.token = token
					state.user = JSON.parse(user)
					state.isAuthenticated = true
				}
			}

			state.isLoading = false
		},
	},
})

export const { setCredentials, logout, restoreSession } = authSlice.actions
export const authReducer = authSlice.reducer
