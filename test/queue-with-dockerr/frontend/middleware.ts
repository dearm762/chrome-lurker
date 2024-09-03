import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { checkCookie, checkInvalid } from './actions/check-cookie'
import { getLanguage } from './actions/set-cookie'

export function middleware(request: NextRequest) {
	const PATH: string = request.nextUrl.pathname
	const phone_number: boolean = checkCookie('phone_number')
	const ticketId: boolean = checkCookie('ticket_id')
	const ISWORKER: boolean = checkCookie('token')
	const Invalid: boolean = checkInvalid()
	const lang = getLanguage()

	if (
		PATH.startsWith('/_next') ||
		// PATH.startsWith('/auth') ||
		PATH.startsWith('/screen')
	)
		return NextResponse.next()

	if (PATH == '/auth') {
		return NextResponse.redirect(new URL('/auth/sign-in', request.url))
	}
	if (PATH == '/invalid' && !Invalid) {
		return NextResponse.redirect(new URL('/auth/sign-in', request.url))
	}
	if (PATH.startsWith('/auth') && ISWORKER && Invalid) {
		return NextResponse.redirect(new URL('/invalid', request.url))
	}

	if (PATH.startsWith('/auth') && ISWORKER) {
		return NextResponse.redirect(new URL('/dashboard', request.url))
	}

	if (PATH == '/dashboard' && ISWORKER && Invalid) {
		return NextResponse.redirect(new URL('/auth/sign-in', request.url))
	}

	if (PATH == '/dashboard' && !ISWORKER) {
		return NextResponse.redirect(new URL('/auth/sign-in', request.url))
	}

	if (PATH === '/ticket' && !ticketId && !phone_number) {
		return NextResponse.redirect(new URL('/', request.url))
	}
	if (PATH === '/ticket' && !ticketId && phone_number) {
		return NextResponse.redirect(new URL('/categories', request.url))
	}
	if (PATH === '/categories' && !phone_number) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	if (PATH === '/' && ticketId)
		return NextResponse.redirect(new URL('/ticket', request.url))

	if (PATH === '/' && phone_number)
		return NextResponse.redirect(new URL('/categories', request.url))

	return NextResponse.next()
}
