'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import EmailInput from '../input/email-input'
import Heading from '../text/heading'
import Info from '../text/info'
import urlCreator from '@/utils/url-creator'
import DashboardHeader from '../header/dashboard'
import { useRouter } from 'next/navigation'
import { Language } from '@/types/lang'
import { getLanguage } from '@/actions/set-cookie'
import locales from '@/locales/common.json'
import Loading from '../wrapper/loading'
import ErrorAlert from '../wrapper/Alert'
import Alert from '../wrapper/Alert'

export default function ForgotPassword() {
	const [email, setEmail] = useState('')
	const router = useRouter()
	const [lang, setLanguage]= useState<Language>('ru')
	const [loading, setLoading] = useState<boolean>(true)
	const [alert, setAlert] = useState({ type: '', message: '', visible: false });

	const showAlert = (type:string, message: string) => {
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
		try{
			setLoading(true)
			e.preventDefault() 
			const response = await fetch(urlCreator('auth/forget-password'), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email })
			})
			const data = await response.json()
			if (response.ok) {
				showAlert('success','На ваш адрес электронной почты отправлено письмо с инструкцией для сброса пароля.')
			} else if (response.status === 404) {
				showAlert('error','Пользователь с таким электронной почты не найдено')
			}else{
				showAlert('info',data.detail)
			}
		}catch(e){
			console.error(e)
		}finally{
			setLoading(false)
		}
	}

	if (loading) {
    return <Loading />
  }
	return (
		<>
		<DashboardHeader  />

		{alert.visible && <Alert type={alert.type} message={alert.message} onClose={hideAlert} />}
		
		<form className='flex flex-col gap-5 w-[450px]' onSubmit={onSubmit}>
			<Heading text={locales[lang].ForgotPassword.MainText} additionalStyle='text-center' />
			<Info text={locales[lang].ForgotPassword.Description} />
			<EmailInput value={email} setValue={setEmail} customWidth='100%' customPlaceholder={locales[lang].ForgotPassword.Email}/>
			<div className='flex justify-between gap-5 items-center'>
				<Link className='bg-main py-2 rounded-md text-white w-1/2 text-center' href={'/auth/sign-in'}>{locales[lang].ForgotPassword.BackToButton}</Link>
				<button className='bg-secondary py-2 rounded-md text-white w-1/2'>{locales[lang].ForgotPassword.ResetButton}</button>
			</div>
		</form>
		
		</>
	)
}
