import {
	deleteCookie,
	getCookie,
	getLanguage,
	setCookie,
} from '@/actions/set-cookie'
import locales from '@/locales/common.json'
import { Language } from '@/types/lang'
import urlCreator from '@/utils/url-creator'
import { ChevronDown, Globe } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface props {
	indicator: boolean
	state: string
}
type response = {
	id: number
	first_name: string
	last_name: string
	email: string
	is_admin: boolean
	window: number
	token: string
	category_id: number
}

export default function DashboardHeader({setIsLoading}:{setIsLoading?:(e:boolean)=>void}) {
	const [user, setUser] = useState<response | undefined>(undefined)
	const router = useRouter()
	const [lang, setLanguage] = useState<Language>('ru')
	const [loading, setLoading] = useState<boolean>(false)

	const handleExit = async () => {
		setIsLoading!(true)
		await deleteCookie('token')
		await deleteCookie('category_id')
		await deleteCookie('token_id')
		await deleteCookie('is')
		await deleteCookie('invalid')
		await setIsLoading!(false)
		router.replace('/auth/sign-in')
	}

	const fetchData = useCallback(async () => {
		const id = await getCookie('token_id')
		const token = await getCookie('token')
		const userid = parseInt(id!)

		try {
			setLoading(true)
			const response = await fetch(urlCreator(`auth/${userid}`))
			const resData = (await response.json()) as response
			if (response.ok) {
				setUser(resData)
				console.log(resData)
				if (resData.token != token) {
					await deleteCookie('token')
					await deleteCookie('token_id')
					await deleteCookie('is')
					router.replace('/auth/sign-in')
					throw new Error('Token is not valid')
				}
			}
			if (response.status === 422) {
				await deleteCookie('token')
				await deleteCookie('token_id')
				await deleteCookie('is')
			}
		} catch (e) {
			console.error(e)
		} finally {
			setLoading(false)
		}
	}, [router])

	const getLang = async () => setLanguage(await getLanguage()) // !!!

	const handleChangeLang = async (e: any) => {
		const lang = e.target.value as Language
		setLanguage(lang)
		setCookie('lang', lang)
		setTimeout(() => {
			window.location.reload()
		}, 10)
	}

	useEffect(() => {
		fetchData()
		getLang()
	}, [fetchData])

	return (
		<header className='bg-white fixed top-0 left-0 right-0'>
			<div className='w-full max-w-[1440px] mx-auto flex justify-between items-center h-28'>
				<Image alt='' src={'/logo/narxoz.png'} width={200} height={70} />
				<div className='flex items-center gap-7'>
					{user && (
						<div className='dropdown dropdown-bottom dropdown-end flex'>
							<div tabIndex={0} role='button' className='btn m-1'>
								<span>{user.first_name}</span>
								<ChevronDown />
							</div>
							<ul
								tabIndex={0}
								className='dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow '
							>
								<li>
									<div onClick={handleExit}>Выйти</div>
								</li>
							</ul>
						</div>
					)}
					<div className='flex gap-3 items-center'>
						<label htmlFor='language'>
							<Globe />
						</label>
						<select
							className='select select-bordered w-full max-w-xs'
							onChange={e => handleChangeLang(e)}
							value={lang}
							name='language'
						>
							<option disabled>{locales[lang].languages.text}</option>
							<option value={'kz'}>{locales[lang].languages.kz}</option>
							<option value={'ru'}>{locales[lang].languages.ru}</option>
							<option value={'en'}>{locales[lang].languages.en}</option>
						</select>
					</div>
				</div>
			</div>
		</header>
	)
}
