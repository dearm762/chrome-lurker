'use server'

import { Language } from '@/types/lang'
import { cookies } from 'next/headers'
    
export async function setCookie(name: string, email: string) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 3);
    cookies().set(name, email, { httpOnly: true, path: '/', expires: expires})
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