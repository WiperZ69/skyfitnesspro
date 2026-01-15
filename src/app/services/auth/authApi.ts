import axios from 'axios'
import { BASE_API_URL, ROUTE_API_URL } from '../../../lib/constants'

type AuthUserProps = {
	email: string
	password: string
}

type RegisterUserProps = {
	email: string
	password: string
}

export type User = {
	_id: string
	email: string
	password: string
	selectedCourses: string[]
	courseProgress: string[]
	createdAt: string
	updatedAt: string
	__v: number
}

export type UserResponse = {
	user: User
}

export type AuthResponse = {
	token: string
}

function handleAxiosError(error: unknown): never {
	if (axios.isAxiosError(error)) {
		const msg =
			error.response?.data?.message ||
			error.response?.data?.error ||
			'Ошибка сервера'

		throw new Error(msg)
	}

	throw new Error('Неизвестная ошибка')
}

export async function authUser(data: AuthUserProps): Promise<AuthResponse> {
	try {
		const res = await axios.post(
			`${BASE_API_URL}${ROUTE_API_URL.login}`,
			data,
			{
				headers: { 'Content-Type': '' },
			}
		)
		return res.data
	} catch (error) {
		handleAxiosError(error)
	}
}

export async function registerUser(
	data: RegisterUserProps
): Promise<AuthResponse> {
	try {
		const res = await axios.post(
			`${BASE_API_URL}${ROUTE_API_URL.register}`,
			data,
			{
				headers: { 'Content-Type': '' },
			}
		)
		return res.data
	} catch (error) {
		handleAxiosError(error)
	}
}

export async function getUser(token: string): Promise<UserResponse> {
	try {
		const res = await axios.get(`${BASE_API_URL}/users/me`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		return res.data
	} catch (error) {
		handleAxiosError(error)
	}
}
