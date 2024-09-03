'use client'

import { getLanguage, setCookie } from '@/actions/set-cookie'
import locales from '@/locales/common.json'
import { Language } from '@/types/lang'
import urlCreator from '@/utils/url-creator'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import DashboardHeader from '../header/dashboard'
import EmailInput from '../input/email-input'
import PasswordInput from '../input/password-input'
import Heading from '../text/heading'
import Alert from '../wrapper/Alert'
import Loading from '../wrapper/loading'

export default function SignInForm() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState<boolean>(true)
	const [loading2, setLoading2] = useState<boolean>(false)
	const [error, setError] = useState(null)
	const router = useRouter()
	const [lang, setLanguage] = useState<Language>('ru')
	const [alert, setAlert] = useState({ type: '', message: '', visible: false })

	const showAlert = (type: string, message: string) => {
		setAlert({ type, message, visible: true })
	}

	const hideAlert = () => {
		setAlert({ ...alert, visible: false })
	}
	
	const getLang = async () => {setLanguage(await getLanguage()), setLoading(false)}

	useEffect(() => {
		getLang()
	}, [])

	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		setLoading2(true)
		try {
			const response = await fetch(urlCreator('auth/login'), {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({
					email,
					password,
				}),
			})
			const data = await response.json()
			console.log(data)
			if (response.ok) {
				await setCookie('token', data.token)
				await setCookie('token_id', data.id)
				if (data.category_id == null && data.is_admin) {
					await setCookie('is', data.is_admin)
					await setCookie('invalid', '0')
					router.replace('/dashboard')
				} else if(data.category_id) {
					await setCookie('is', data.is_admin)
					await setCookie('invalid', '0')
					router.replace('/dashboard')
				}else{
					await setCookie('invalid', '1')
					router.replace('/invalid')
				}
			}
			if (!response.ok) {
				showAlert('error', data.detail)

				console.log(data)
			}
		} catch (err: any) {
			setError(err)
			console.error(err)
		} finally {
			setLoading2(false)
		}
	}
	if (loading) {
		return <Loading />
	}
	return (

		<>
			<title>Нархоз Университеті | Авторизация</title>
			{loading2 && <Loading/>}
			<DashboardHeader />
			{alert.visible && (
				<Alert type={alert.type} message={alert.message} onClose={hideAlert} />
			)}

			<form className='flex flex-col gap-5 w-[450px]' onSubmit={onSubmit}>
				<Heading
					text={locales[lang].SignIn.MainText}
					additionalStyle='text-center'
				/>
				{error && <p className='text-red-500 font-bold'>{error}</p>}
				<EmailInput
					value={email}
					setValue={setEmail}
					customWidth='100%'
					customPlaceholder={locales[lang].SignIn.Email}
				/>
				<PasswordInput
					value={password}
					setValue={setPassword}
					customWidth='100%'
					customPlaceholder={locales[lang].SignIn.Password}
				/>
				<div className='flex justify-between gap-5 items-center'>
					<Link
						className='bg-main py-2 rounded-md text-white w-1/2 text-center'
						href={'/auth/forgot-password'}
					>
						{locales[lang].SignIn.ForgetPasswordButton}
					</Link>
					<button className='bg-secondary py-2 rounded-md text-white w-1/2'>
						{locales[lang].SignIn.SignInButton}
					</button>
				</div>
			</form>
		</>
	)
}
