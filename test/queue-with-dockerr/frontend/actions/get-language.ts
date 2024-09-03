import { Language } from "@/types/lang"
import { setCookie } from "./set-cookie"

export const getDeviceLanguage = (): Language => {
    const deviceLanguage = navigator.language || navigator.languages[0]
    const lang = deviceLanguage.substring(0, 2) as Language

    if (lang === 'kz' || lang === 'en' || lang === 'ru') {
        setCookie('lang', lang)
        return lang
    }

    const defaultLang: Language = 'kz'
    setCookie('lang', defaultLang)
    return defaultLang
}