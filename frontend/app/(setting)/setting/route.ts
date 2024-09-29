'use server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
	const { tid, password } = await request.json();

	if (tid && password === 'Aktau7292') {
		cookies().set('token_id', tid, {
			path: '/',
			httpOnly: true,
			secure: true,
			maxAge: 86400,
		})
		return new Response('Cookie set successfully', { status: 200 })
	}

	return new Response('Invalid ID or password', { status: 400 })
}
