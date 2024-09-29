'use server'

import { cookies } from 'next/headers'

const checkCookie = (cookName: string) => {
	return cookies().has(cookName)
}
const checkInvalid = () => {
	return cookies().get('invalid')?.value == '1'
}

export {checkCookie, checkInvalid}
