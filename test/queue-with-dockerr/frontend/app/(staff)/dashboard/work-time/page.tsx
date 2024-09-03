'use client'

import { useState, useEffect, FormEvent } from 'react'
import Link from 'next/link'
import { getLanguage } from '@/actions/set-cookie'
import DashboardHeader from '@/components/header/dashboard'
import Heading from '@/components/text/heading'
import Loading from '@/components/wrapper/loading'
import locales from '@/locales/common.json'
import { Language } from '@/types/lang'
import urlCreator from '@/utils/url-creator'

export default function AddUser() {
	const [formData, setFormData] = useState({
		from: '09:00',
		to: '17:00',
	})
	const [lang, setLanguage] = useState<Language>('ru')
	const [loading, setLoading] = useState<boolean>(true)
	const [loading2, setLoading2] = useState<boolean>(false)

	useEffect(() => {
		const fetchLanguage = async () => {
			const language = await getLanguage()
			setLanguage(language)
			setLoading(false)
		}
		const fetchWorkTime = async () => {
			fetch(urlCreator('setting'), {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}).then(res => res.json()).then(data => {
				setFormData({ from: data.fromm, to: data.to })
			})
		}
		fetchWorkTime()
		fetchLanguage()
	}, [])

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'from' | 'to') => {
		const value = e.target.value
		setFormData((prevState) => ({
			...prevState,
			[type]: value,
		}))
	}

	const setWorkTime = (e: FormEvent) => {
		e.preventDefault()
		fetch(urlCreator('setting/1'), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ ...formData, fromm: formData.from })
		})
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
							text={'Set Up Work Time:'}
							additionalStyle='text-center mt-20'
						/>
						<form className="max-w-[16rem] mx-auto grid grid-cols-2 gap-4">
							<div>
								<label htmlFor="start-time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start time:</label>
								<div className="relative">
									<div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
										<svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
											<path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clipRule="evenodd" />
										</svg>
									</div>
									<input
										type="time"
										id="start-time"
										className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										min="09:00"
										max="18:00"
										value={formData.from}
										onChange={(e) => handleTimeChange(e, 'from')}
										required
									/>
								</div>
							</div>
							<div>
								<label htmlFor="end-time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End time:</label>
								<div className="relative">
									<div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
										<svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
											<path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clipRule="evenodd" />
										</svg>
									</div>
									<input
										type="time"
										id="end-time"
										className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										min="09:00"
										max="18:00"
										value={formData.to}
										onChange={(e) => handleTimeChange(e, 'to')}
										required
									/>
								</div>
							</div>
						</form>
						<p className='text-center text-red-500'>
							*{'Staff won\'t be able to work out of this time and students can\'t get to line'}
						</p>
						<div className='flex justify-center '>
							<Link
								href={'/dashboard'}
								className='bg-main rounded-md mt-6 py-3 text-white px-10 mb-10'
							>
								{locales[lang].AddUser.BackToButton}
							</Link>
							<button className='bg-black ml-3 rounded-md mt-6 py-3 text-white px-10 mb-10' onClick={e => setWorkTime(e)}>Save</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
