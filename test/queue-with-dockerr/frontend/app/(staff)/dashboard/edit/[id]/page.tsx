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
import { useParams, useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'

interface formdata {
	first_name: string
	last_name: string
	email: string
	is_admin: boolean
	window: string
	category_id: string | number
	admin_token: string
}

export default function AddUser() {
	const { id } = useParams()
	const [formData, setFormData] = useState<formdata>({
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
		EditUser()
	}

	const fetchData = useCallback(async () => {
		try {
			const response = await fetch(urlCreator(`auth/${id}`))
			const data = await response.json()
			if (response.ok) {
				setFormData(data)
			}
		} catch (err) {
			console.error(err)
		} finally {
			setLoading(false)
		}
	}, [id])

	const getLang = async () => {setLanguage(await getLanguage()), setLoading(false)}

	const fetchCategories = async () => {
		try {
			const response = await fetch(urlCreator('category/'))
			const data = await response.json()
			if (response.ok) {
				setCategories(data)
			}
		} catch (e) {
			console.error(e)
		}
	}
	useEffect(() => {
		getLang()
		fetchCategories()
		fetchData()
	}, [fetchData])

	const get_token = async () => {
		return await getCookie('token')
	}

	const EditUser = async () => {
		try {
			setLoading(true)
			const response = await fetch(urlCreator(`auth/${id}`), {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					category_id: formData.category_id == '' ? null : formData.category_id as number,
					admin_token: await get_token(),
				}),
			})
			if (response.ok) {
				alert('Пользователь успешно изменен!')
				router.replace(`/users/${id}`)
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
			<DashboardHeader setIsLoading={setLoading2}/>
			{
				loading2 && <Loading />
			}
			<div className='min-h-screen pt-32 bg-[#F2F2F2]'>
				<div className='w-full max-w-[1280px] mx-auto flex flex-col pt-10'>
					<div className='bg-white rounded-e-lg'>
						<Heading
							text={locales[lang].EditUser.MainText}
							additionalStyle='text-center mt-20'
						/>
						<form className='flex gap-5 mt-5' onSubmit={handleSubmit}>
							<div className='flex flex-col ml-auto'>
								<span>*{locales[lang].EditUser.FirstName}</span>
								<input
									type='text'
									name='first_name'
									value={formData.first_name}
									onChange={handleChange}
									className='input input-bordered input-success w-[300px]'
								/>
								<span>*{locales[lang].EditUser.Email}:</span>
								<input
									type='text'
									name='email'
									value={formData.email}
									onChange={handleChange}
									className='input input-bordered input-success w-[300px]'
								/>
								<span>*{locales[lang].EditUser.SelectCategory}:</span>
								<select
									name='category_id'
									value={formData.category_id}
									onChange={handleChange}
									className='select select-success w-full max-w-xs'
									required
								>
									<option value={0} disabled>
										{locales[lang].EditUser.SelectCategory}
									</option>
									<option value={''}>{locales[lang].EditUser.Invalid}</option>
									{categories.length > 0 ? (
										categories.map((category, index) => (
											<option key={index} value={category.id!}>
												{category.name}
											</option>
										))
									) : (
										<option value={0} disabled>
											{locales[lang].EditUser.Invalid}
										</option>
									)}
								</select>
							</div>
							<div className='flex flex-col mr-auto'>
								<span>*{locales[lang].EditUser.LastName}:</span>
								<input
									type='text'
									name='last_name'
									value={formData.last_name}
									onChange={handleChange}
									className='input input-bordered input-success w-[300px]'
								/>
								<span>*{locales[lang].EditUser.WindowNumber}:</span>
								<input
									type='number'
									name='window'
									value={formData.window}
									onChange={handleChange}
									className='input input-bordered input-success w-[300px]'
								/>
								<button
									className='bg-secondary rounded-md mt-6 py-3 text-white'
									type='submit'
								>
									{locales[lang].EditUser.EditButton}
								</button>
							</div>
						</form>
						<div className='flex justify-center'>
							<Link
								href={'/dashboard'}
								className='bg-main rounded-md mt-6 py-3 text-white px-10 mb-10'
							>
								{locales[lang].EditUser.BackToButton}
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
