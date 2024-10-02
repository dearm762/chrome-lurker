'use client'
import { getCookie, getLanguage } from '@/actions/set-cookie'
import DashboardHeader from '@/components/header/dashboard'
import StatisticMiniCard from '@/components/statistic-mini-card'
import Heading from '@/components/text/heading'
import TicketTable from '@/components/ticket-table'
import UserInformation from '@/components/user-information'
import Loading from '@/components/wrapper/loading'
import locales from '@/locales/common.json'
import { Language } from '@/types/lang'
import urlCreator from '@/utils/url-creator'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import React from 'react'

type UserResponse = {
	id: number
	first_name: string
	last_name: string
	email: string
	is_admin: boolean
	window: number
	token: string
	category_id: number
}

export type User = {
	id: number
	first_name: string
	last_name: string
	email: string
	is_admin: boolean
	window: number
	token: string
	category: string
}

export interface Ticket {
	created_at: string
	phone_number: string
	full_name: string
	status: string
	language: string
	id: number
	category_id: number
	number: string
	worker_id: number,
	rate: number
}

export interface StatisticData {
	accepted_last_month: number
	skipped_last_month: number
	served_last_month: number
	tickets: Ticket[]
	average_rate: number | null
}

export default function UserPage() {
	const { id } = useParams()
	const [data, setData] = useState<User | undefined>(undefined)
	const [loading, setLoading] = useState<boolean>(true)
	const [loading2, setLoading2] = useState<boolean>(false)
	const [lang, setLanguage] = useState<Language>('ru')
	const [period, setPeriod] = useState<'1_day' | '1_week' | '1_month'>('1_day')
	const [clients, setClients] = useState<Ticket[]>([])
	const [information, setInformation] = useState<StatisticData | undefined>(undefined)
	const router = useRouter()

	// Fetch user and general information
	const fetchData = useCallback(async () => {
		try {
			const [userResponse, infoResponse] = await Promise.all([
				fetch(urlCreator(`auth/${id}`)),
				fetch(urlCreator(`interface/admin/user_information/${id}`)),
			])

			if (userResponse.ok) {
				const userData: UserResponse = await userResponse.json()

				let categoryName = ''
				if (userData.category_id) {
					const categoryResponse = await fetch(
						urlCreator(`category/${userData.category_id}`)
					)
					if (categoryResponse.ok) {
						const categoryData = await categoryResponse.json()
						categoryName = categoryData.name
					}
				}

				setData({
					id: userData.id,
					first_name: userData.first_name,
					last_name: userData.last_name,
					email: userData.email,
					is_admin: userData.is_admin,
					window: userData.window,
					token: userData.token,
					category: categoryName,
				})
			}
			if (infoResponse.status === 404) {
				router.replace('/dashboard')
			}

			if (infoResponse.ok) {
				const infoData: StatisticData = await infoResponse.json()
				setInformation(infoData)
			}
		} catch (error) {
			console.error('Error fetching data:', error)
		} finally {
			setLoading(false)
		}
	}, [id, router])

	const fetchTicketsByPeriod = useCallback(async (selectedPeriod: string) => {
		try {
			const response = await fetch(
				`https://e-queue.narxoz.kz/api/interface/admin/statistics/26/${selectedPeriod}/`
			)
			if (response.ok) {
				const ticketData: Ticket[] = await response.json()
				setClients(ticketData)
			}
		} catch (error) {
			console.error('Error fetching tickets:', error)
		}
	}, [])

	const getLang = useCallback(async () => {
		const language = await getLanguage()
		setLanguage(language)
	}, [])

	useEffect(() => {
		getLang()
		fetchData()
	}, [fetchData, getLang])

	useEffect(() => {
		fetchTicketsByPeriod(period)
	}, [period, fetchTicketsByPeriod])

	const deleteUser = async () => {
		try {
			setLoading(true)
			const token = await getCookie('token')
			const response = await fetch(urlCreator(`auth/${id}`), {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					admin_token: token,
				}),
			})
			if (response.ok) {
				router.replace('/dashboard')
			}
		} catch (error) {
			console.error('Error deleting user:', error)
		} finally {
			setLoading(false)
		}
	}

	const memoizedData = useMemo(() => data, [data])

	if (loading) {
		return <Loading />
	}

	return (
		<>
			<title>Нархоз Университеті | Пользователь</title>
			<DashboardHeader setIsLoading={setLoading2} />
			{loading2 && <Loading />}
			<div className='bg-[#F2F2F2] min-h-screen'>
				<div className='w-full max-w-[1280px] mx-auto pt-32 pb-10'>
					<Heading text={locales[lang].user.MainText} additionalStyle='mt-3' />
					<div className='flex flex-row justify-between items-center w-full'>
						<UserInformation
							memoizedData={memoizedData!}
							locales={locales}
							lang={lang}
							rate={information?.average_rate}
						/>
						<div className='h-full flex flex-col justify-center gap-8'>
							<div className='w-full flex flex-row justify-between items-center	gap-3'>
								<Link
									href={`/dashboard/edit/${id}`}
									className='bg-black text-white font-bold text-2xl rounded-md py-5 px-5 grow hover:bg-[#111827] duration-700 flex justify-center gap-1 max-w-96 shadow'
								>
									<span>{locales[lang].user.ButtonEdit}</span>
								</Link>
								<button
									className='bg-red-500 text-white font-bold text-2xl rounded-md py-5 px-5 grow hover:bg-red-600 duration-700 flex justify-center gap-1 max-w-96 shadow'
									onClick={deleteUser}
								>
									<span>{locales[lang].user.ButtonDelete}</span>
								</button>
							</div>
							<StatisticMiniCard
								data={{
									accepted_last_month: information?.accepted_last_month ?? 0,
									skipped_last_month: information?.skipped_last_month ?? 0,
									served_last_month: information?.served_last_month ?? 0,
								}}
								lang={lang}
							/>
						</div>
					</div>
					<Heading text={locales[lang].user.Tickets} additionalStyle='mt-10' />
					<TicketTable lang={lang} data={clients} period={period} setPeriod={setPeriod} />
				</div>
			</div>
		</>
	)
}
