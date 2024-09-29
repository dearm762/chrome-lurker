'use client'

import { getDeviceLanguage } from '@/actions/get-language'
import { setCookie } from '@/actions/set-cookie'
import Loading from '@/components/wrapper/loading'
import locales from '@/locales/common.json'
import { Language } from '@/types/lang'
import urlCreator from '@/utils/url-creator'
import { useRouter } from 'next/navigation'
import { FC, FormEvent, useEffect, useState } from 'react'
import EmailInput from '../input/email-input'
import PhoneNumberInput from '../input/phone-number-input'
import Heading from '../text/heading'
import Info from '../text/info'

const WarningAlert: FC<{ text: string }> = ({ text }) => {
	return (
		<div role='alert' className='alert alert-warning'>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				className='h-6 w-6 shrink-0 stroke-current'
				fill='none'
				viewBox='0 0 24 24'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='2'
					d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
				/>
			</svg>
			<span>{text}</span>
		</div>
	)
}

export default function CheckInForm() {
	const router = useRouter()
	const [fullname, setFullname] = useState('')
	const [phoneNumber, setPhoneNumber] = useState('')
	const [lang, setLang] = useState<Language>('ru')
	const [loading, setLoading] = useState<boolean>(true)
	const [loading2, setLoading2] = useState<boolean>(false)
	const [isWorkTime, setIsWorkTime] = useState<boolean>(true)
	const [workTime, setWorkTime] = useState({
		from: '',
		to: '',
	})

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		// setLoading2(true)

		await setCookie('phone_number', phoneNumber)
		await setCookie('full_name', fullname)
		await setCookie('lang', lang)
		router.push('/categories', { scroll: false })
		// setLoading2(false)
	}

	const get_lang = () => {
		setLang(getDeviceLanguage())
	}

	const get_workTime = async () => {
		await fetch(urlCreator('setting/'), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(response => response.json())
			.then(data => {
				const { permission } = data
				if (!permission) {
					setIsWorkTime(false)
					setWorkTime({ from: data.fromm, to: data.to })
				}
			})
			.catch(error => {
				console.error('Error fetching settings:', error)
				setIsWorkTime(false)
			})
			.finally(() => setLoading(false))
	}

	useEffect(() => {
		get_lang()
		get_workTime()
	}, [])

	const handleChangeLang = async (e: any) => {
		const lang = e.target.value as Language
		setLang(lang)
		await setCookie('lang', lang)
	}

	if (loading) {
		return <Loading />
	}

	return (
		<>
			{loading2 && <Loading />}
			<h1 className='sr-only' >Электронная очередь в Нархоз Университете</h1>
			<form
				className='h-full flex flex-col justify-center mt-[-20px]'
				onSubmit={handleSubmit}
			>
				<div className='flex flex-col items-center px-5 gap-4'>
					<Heading text={locales[lang].main.Main} />
					<Info text={locales[lang].main.Description} />
					<EmailInput
						value={fullname}
						setValue={setFullname}
						type='text'
						customPlaceholder={locales[lang].main.Input}
					/>
					<PhoneNumberInput value={phoneNumber} onChange={setPhoneNumber} />
					<select
						className='select select-bordered w-full join-item max-w-96'
						onChange={handleChangeLang}
						value={lang}
						required
					>
						<option value='kz'>{locales[lang].languages.kz}</option>
						<option value='ru'>{locales[lang].languages.ru}</option>
						<option value='en'>{locales[lang].languages.en}</option>
					</select>
					{!isWorkTime && (
						<WarningAlert
							text={locales[lang].main.WarningText.replace(
								'{{from}}',
								workTime.from
							).replace('{{to}}', workTime.to)}
						/>
					)}
					<button
						type='submit'
						className='bg-main w-full py-2 text-white rounded-lg disabled:bg-red-300'
						disabled={!isWorkTime || !fullname || !phoneNumber}
					>
						{loading2 ? (
							<span className='loading loading-spinner loading-xs translate-y-1'></span>
						) : (
							locales[lang].main.Button
						)}
					</button>
				</div>
			</form>
		</>
	)
}
