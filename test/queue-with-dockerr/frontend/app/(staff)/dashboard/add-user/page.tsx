'use client'

import { getCookie, getLanguage } from '@/actions/set-cookie'
import DashboardHeader from '@/components/header/dashboard'
import Heading from '@/components/text/heading'
import Loading from '@/components/wrapper/loading'
import locales from '@/locales/common.json'
import { category } from '@/types/adminDashboard'
import { Language } from '@/types/lang'
import urlCreator from '@/utils/url-creator'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

export default function AddUser() {
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		email: '',
		is_admin: false,
		window: '',
		category_id: 0,
		admin_token: '',
	})
	const [lang, setLanguage] = useState<Language>('ru')
	const router = useRouter()
	const [categories, setCategories] = useState<category[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [loading2, setLoading2] = useState<boolean>(false)

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target
		setFormData(prevData => ({
			...prevData,
			[name]: name === 'category_id' ? parseInt(value) : value,
		}))
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		CreateUser()
	}

	const getLang = async () => setLanguage(await getLanguage())

	const fetchCategories = async () => {
		try {
			setLoading(true)
			const response = await fetch(urlCreator('category/'))
			const data = await response.json()
			if (response.ok) {
				setCategories(data)
			}
		} catch (e) {
			console.error(e)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		getLang()
		fetchCategories()
		const getToken = async () => {
			const token = await getCookie('token')
			setFormData(prevData => ({
				...prevData,
				admin_token: token ?? '', // Используем значение по умолчанию '' если token undefined
			}))
		}
		getToken()
	}, [])

	const CreateUser = async () => {
		try {
			setLoading(true)
			const response = await fetch(urlCreator('auth/register/'), {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			})
			if (response.ok) {
				alert('Пользователь успешно добавлен!')
				router.replace('/dashboard')
			} else {
				alert('Ошибка при добавлении пользователя!')
			}
		} catch (e) {
			console.error(e)
		} finally {
			setLoading(false)
		}
	}
	if (loading) {
		return <Loading />
	}

	return (
		<>
			{loading2 && <Loading />}
			<DashboardHeader setIsLoading={setLoading2} />

			<div className='min-h-screen pt-32 bg-[#F2F2F2]'>
				<div className='w-full max-w-[1280px] mx-auto flex flex-col pt-10'>
					<div className='bg-white rounded-e-lg'>
						<Heading
							text={locales[lang].AddUser.MainText}
							additionalStyle='text-center mt-20'
						/>
						<form className='flex gap-5 mt-5' onSubmit={handleSubmit}>
							<div className='flex flex-col ml-auto'>
								<span>*{locales[lang].AddUser.FirstName}</span>
								<input
									type='text'
									name='first_name'
									value={formData.first_name}
									onChange={handleChange}
									required
									className='input input-bordered input-success w-[300px]'
								/>
								<span>*{locales[lang].AddUser.Email}:</span>
								<input
									type='text'
									name='email'
									value={formData.email}
									onChange={handleChange}
									required
									className='input input-bordered input-success w-[300px]'
								/>
								<span>*{locales[lang].AddUser.SelectCategory}:</span>
								<select
									name='category_id'
									value={formData.category_id}
									onChange={handleChange}
									className='select select-success w-full max-w-xs'
									required
								>
									<option value={0} disabled>
										{locales[lang].AddUser.SelectCategory}
									</option>
									{categories.map(category => (
										<option key={category.id} value={category.id as number}>
											{category.name}
										</option>
									))}
								</select>
							</div>
							<div className='flex flex-col mr-auto'>
								<span>*{locales[lang].AddUser.LastName}:</span>
								<input
									type='text'
									name='last_name'
									value={formData.last_name}
									onChange={handleChange}
									className='input input-bordered input-success w-[300px]'
									required
								/>
								<span>*{locales[lang].AddUser.WindowNumber}:</span>
								<input
									type='number'
									name='window'
									value={formData.window}
									onChange={handleChange}
									className='input input-bordered input-success w-[300px]'
									required
								/>
								<button
									className='bg-black rounded-md mt-6 py-3 text-white'
									type='submit'
								>
									{locales[lang].AddUser.AddButton}
								</button>
							</div>
						</form>
						<p className='text-center text-red-500 mt-2'>
							*{locales[lang].AddUser.WarningText}
						</p>
						<p className='text-center text-red-500'>
							*{locales[lang].AddUser.SpamText}
						</p>
						<div className='flex justify-center'>
							<Link
								href={'/dashboard'}
								className='bg-main rounded-md mt-6 py-3 text-white px-10 mb-10'
							>
								{locales[lang].AddUser.BackToButton}
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
