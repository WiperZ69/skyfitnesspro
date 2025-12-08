import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	const body = await req.json()

	const res = await fetch('http://localhost:3000/api/fitness/auth/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	})

	const data = await res.json()

	if (!res.ok) {
		return NextResponse.json({ message: data.message }, { status: 400 })
	}

	const response = NextResponse.json({ message: 'ok' })

	response.cookies.set('token', data.token, {
		httpOnly: true,
		secure: true,
		path: '/',
		maxAge: 60 * 60 * 24 * 7, // 7 days
	})

	return response
}
