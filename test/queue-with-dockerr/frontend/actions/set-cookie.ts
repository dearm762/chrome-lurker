'use server'

import { Language } from '@/types/lang'
import { cookies } from 'next/headers'

export async function setCookie(name: string, email: string) {
    cookies().set(name, email, { httpOnly: true, path: '/' })
}
export async function deleteCookie(name: string) {
    cookies().delete(name)
}

export async function getCookie(name: string) {
    return cookies().get(name)?.value!
}

export const getLanguage = () => {
    const lang: Language = cookies().get('lang')?.value as Language
    if (!lang) {
        return 'ru'
    }
    return lang
}