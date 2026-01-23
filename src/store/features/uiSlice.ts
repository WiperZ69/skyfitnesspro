import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ModalType = 'login' | 'signup' | null

export interface UIState {
	authModal: {
		isOpen: boolean
		type: ModalType
	}
}

const initialState: UIState = {
	authModal: {
		isOpen: false,
		type: null,
	},
}

const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		openAuthModal: (state, action: PayloadAction<ModalType>) => {
			state.authModal.isOpen = true
			state.authModal.type = action.payload
		},
		closeAuthModal: state => {
			state.authModal.isOpen = false
			state.authModal.type = null
		},
		switchAuthModal: (state, action: PayloadAction<ModalType>) => {
			state.authModal.type = action.payload
		},
	},
})

export const { openAuthModal, closeAuthModal, switchAuthModal } =
	uiSlice.actions
export const uiReducer = uiSlice.reducer
