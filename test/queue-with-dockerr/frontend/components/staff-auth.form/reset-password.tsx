'use client'

import { FormEvent, useEffect, useState } from 'react'
import PasswordInput from '../input/password-input'
import Heading from '../text/heading'
import Info from '../text/info'
import { useParams, useRouter } from 'next/navigation'
import urlCreator from '@/utils/url-creator'
import { Language } from '@/types/lang'
import { getLanguage } from '@/actions/set-cookie'
import locales from '@/locales/common.json'
import DashboardHeader from '../header/dashboard'
import Loading from '../wrapper/loading'
import Alert from '../wrapper/Alert'


export default function ResetPassword() {
	const [password, setPassword] = useState('')
	const [verify, setVerify] = useState('')
	const { resetToken } = useParams()
	const [error, setError] = useState<string>('')
	const [loading, setLoading] = useState<boolean>(true)
	const router = useRouter()
	const [lang, setLanguage] = useState<Language>('ru')
	const [alert, setAlert] = useState({ type: '', message: '', visible: false });

	const showAlert = (type: string, message: string) => {
		setAlert({ type, message, visible: true });
	};

	const hideAlert = () => {
		setAlert({ ...alert, visible: false });
	};

	const getLang = async () => {setLanguage(await getLanguage()), setLoading(false)}


	useEffect(() => {
		getLang()
	}, [])

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault()
		if (password !== verify) {
			setError("Пароли не совпадают")
			return
		}
		try {
			setLoading(true)
			const response = await fetch(urlCreator('auth/reset-password'), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ "token": resetToken, "new_password": password })
			})
			const data = await response.json()
			if (response.ok) {
				showAlert('success', 'Пароль успешно изменен.')
				setError('')
				setLoading(true)
				setTimeout(() => {
					router.replace('/auth/sign-in')
					setLoading(false)
				}, 2000)
			}
			else {
				setError(data.detail)
			}
		} catch (e) {
			console.log(e)
		} finally {
			setLoading(false)
		}


	}
	if (loading) {
    return <Loading />
  }

	return (<>
		{alert.visible && <Alert type={alert.type} message={alert.message} onClose={hideAlert} />}

		<DashboardHeader />

		<form className='flex flex-col gap-5 w-[450px]' onSubmit={onSubmit}>
			<Heading text={locales[lang].ResetPassword.MainText} additionalStyle='text-center' />
			<Info text={locales[lang].ResetPassword.Description} />
			<PasswordInput value={password} setValue={setPassword} customWidth='100%' customPlaceholder={locales[lang].ResetPassword.Password} />
			<PasswordInput value={verify} setValue={setVerify} customWidth='100%' customPlaceholder={locales[lang].ResetPassword.ConfirmPassword} />
			<button className='bg-secondary py-2 rounded-md text-white'>{locales[lang].ResetPassword.ResetButton}</button>
		</form>
	</>
	)
}
