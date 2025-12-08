import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	const body = await req.json()

	const res = await fetch('http://localhost:3000/api/fitness/auth/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	})

	const data = await res.json()

	if (!res.ok) {
		return NextResponse.json({ message: data.message }, { status: 400 })
	}

	return NextResponse.json({ message: 'success' })
}
