'use client'
import React from 'react'
import { deleteCookie, getCookie, getLanguage } from '@/actions/set-cookie'
import Header from '@/components/header'
import Heading from '@/components/text/heading'
import Info from '@/components/text/info'
import TicketsStatus from '@/components/tickets-status'
import Wrapper from '@/components/wrapper'
import Loading from '@/components/wrapper/loading'
import locales from '@/locales/common.json'
import { Language } from '@/types/lang'
import ticket from '@/types/ticket-page'
import {
	Average,
	NewTicket,
	NewTicketWrapper,
	WebSocketMessage,
	isNewTicket,
} from '@/types/websocket'
import urlCreator from '@/utils/url-creator'
import {
	disconnectSocket,
	initiateSocket,
	subscribeToEvent,
} from '@/utils/websocket'
import { Copyright } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import blackstyle from './circleblack.module.scss'
import greenstyle from './circlegreen.module.scss'
import whitestyle from './circlewhite.module.scss'
import styles from './ticket.module.sass'
import RatingComponent from './rate'

export interface tickets {
	data: NewTicketWrapper
	active: boolean
}
``
interface ticket2 {
	id: number
	full_name: string
	phone_number: string
	created_at: string
	category_id: number
	status: string
	number: string
	worker_id: null
	language: string
	token: string
}

export default function Page() {
	const router = useRouter()
	const [loading, setLoading] = useState<boolean>(true)
	const [rate, setRate] = useState<boolean>(false)
	const [loading2, setLoading2] = useState<boolean>(false)
	const [data, setData] = useState<ticket>({
		ticket_id: 0,
		ticket_number: '',
		front_queue: 0,
		current_ticket: '',
		ticket_created_time: '',
		category_id: 0,
		token: '',
		average_duration: 0,
	})
	const [data2, setData2] = useState<ticket2>()
	const [token_ticket, setTokenTicket] = useState<string>('')
	const [livelist, setLivelist] = useState<tickets[]>([])
	const [ticket_version, setTicketVersion] = useState<number>(1)
	const [lang, setLanguage] = useState<Language>('ru')
	const [modal, setModal] = useState<boolean>(false)
	const [circleColor, setCircleColor] = useState<'black' | 'white' | 'green'>(
		'black'
	)
	const [circleStyle, setCircleStyle] = useState<string>(blackstyle.style)

	const handleTouch = () => {
		if (circleColor === 'green') {
			return
		}
		setCircleColor('white')
		setTimeout(() => setCircleColor('black'), 2000)
	}

	useEffect(
		() =>
			setCircleStyle(
				circleColor === 'black'
					? blackstyle.style
					: circleColor === 'white'
						? whitestyle.style
						: greenstyle.style
			),
		[circleColor]
	)

	const checkTicket = useCallback(async () => {
		try {
			const ticket_id = await getCookie('ticket_id')
			if (!ticket_id) return
			const response = await fetch(urlCreator(`ticket/${ticket_id}`))
			const result: ticket2 = await response.json()
			if (response.ok) {
				setTokenTicket(result.token)

				const { status } = result as any
				if (['cancelled', 'completed', 'skipped'].includes(status)) {
					await deleteCookie('ticket_id')
					await deleteCookie('full_name')
					await deleteCookie('phone_number')
					await deleteCookie('cid')
					router.replace('/')
				} else if (status === 'invited') {
					setTicketVersion(2)
					setCircleColor('green')
					setData(prevData => ({
						...prevData,
						ticket_number: result.number,
					}))
				} else {
					setData2(result)
					setData(prevData => ({
						...prevData,
						ticket_number: result.number,
					}))
				}
			}
		} catch (err) {
			console.error('Error checking ticket:', err)
		}
	}, [router])

	const fetchData = useCallback(async () => {
		try {
			const ticket_id = await getCookie('ticket_id')
			if (!ticket_id) return
			const response = await fetch(
				urlCreator(`interface/client/ticket/${ticket_id}`)
			)
			const result: ticket = await response.json()
			if (response.ok) {
				setData(prevData => ({
					ticket_created_time: result.ticket_created_time,
					ticket_id: result.ticket_id,
					category_id: result.category_id,
					current_ticket: result.current_ticket,
					front_queue: result.front_queue,
					token: result.token,
					ticket_number: prevData.ticket_number,
					average_duration: result.average_duration,
				}))
			}
		} catch (e) {
			console.error('Error fetching data:', e)
		} finally {
			setLoading(false)
		}
	}, [])

	const handleCancelTicket = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			const ticket_id = await getCookie('ticket_id')
			if (!ticket_id) return
			setLoading2(true)
			const response = await fetch(urlCreator(`ticket/${ticket_id}/cancel`))
			await deleteCookie('ticket_id')
			await deleteCookie('full_name')
			await deleteCookie('phone_number')
			await deleteCookie('cid')
			router.push('/')
		} catch (e) {
			console.error('Error canceling ticket:', e)
			await deleteCookie('ticket_id')
			await deleteCookie('full_name')
			await deleteCookie('phone_number')
			await deleteCookie('cid')
			router.push('/')
		} finally {
			setLoading2(false)
		}
	}

	const get_workTime = async () => {
		const response = await fetch(urlCreator('setting/'), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
		const data = await response.json()
		const { permission } = data
		console.log(permission)
		if (!permission) {
			try {
				const ticket_id = await getCookie('ticket_id')
				if (!ticket_id) return
				setLoading2(true)
				const response = await fetch(urlCreator(`ticket/${ticket_id}/cancel`))
				await deleteCookie('ticket_id')
				await deleteCookie('full_name')
				await deleteCookie('phone_number')
				await deleteCookie('cid')
				router.push('/')
			} catch (e) {
				console.error('Error canceling ticket:', e)
				await deleteCookie('ticket_id')
				await deleteCookie('full_name')
				await deleteCookie('phone_number')
				await deleteCookie('cid')
				router.push('/')
			} finally {
				setLoading2(false)
			}
		}
	}

	const getLang = useCallback(async () => {
		try {
			const language = await getLanguage()
			setLanguage(language)
		} catch (e) {
			console.error('Error getting language:', e)
		}
	}, [])

	useEffect(() => {
		get_workTime()
		getLang()
		checkTicket()
		fetchData()
		initiateSocket(() => { })

		subscribeToEvent(async (dataa: WebSocketMessage) => {
			try {
				const cid = await getCookie('cid')
				const tid = await getCookie('ticket_id')
				if (!cid || !tid) return

				if (dataa.action === 'next_ticket') {
					if (dataa.category_id === parseInt(cid) && data.front_queue > 0) {
						setData(prevData => ({
							...prevData,
							front_queue: prevData.front_queue - 1,
						}))
					}
					const data5 = dataa.data as NewTicketWrapper
					if (data5.ticket.id === parseInt(tid)) {
						setCircleColor('green')
						setTicketVersion(2)
					}
					setData(prevData => ({
						...prevData,
						current_ticket: data5!.ticket.number,
					}))
					const newdata = { data: data5, active: true }
					setLivelist(prevData => {
						const updatedList = [newdata, ...prevData]
						return updatedList.length > 5
							? updatedList.slice(0, 5)
							: updatedList
					})
				}

				const ticket_id = await getCookie('ticket_id')
				const ticket = dataa.data as NewTicket
				if (
					dataa.action === 'complete_ticket' &&
					ticket.id === parseInt(ticket_id!)
				) {
					// alert('Спасибо за обращение!')
					setRate(true)
				}

				if (
					dataa.action === 'update_ticket' &&
					ticket.id === parseInt(ticket_id!)
				) {
					alert('У вас пропущен очередь!')
					checkTicket()
				}

				if (
					dataa.action === 'complete_ticket' ||
					dataa.action === 'skip_ticket'
				) {
					setLivelist(prevList =>
						prevList.map(item => {
							if (isNewTicket(dataa.data)) {
								return item.data.ticket.id === dataa.data.id
									? { ...item, active: false }
									: item
							} else {
								const a = dataa.data as NewTicketWrapper
								return item.data.ticket.id === a.ticket.id
									? { ...item, active: false }
									: item
							}
						})
					)
				}

				if (dataa.action === 'average_duration' && dataa.category_id === parseInt(cid)) {
					const a = dataa.data as Average
					setData(prevData => ({
						...prevData,
						average_duration: a.average_duration,
					}))
				}
			} catch (e) {
				console.error('Error handling WebSocket event:', e)
			}
		})

		return () => {
			disconnectSocket()
		}
	}, [checkTicket, fetchData, getLang])

	if (loading) return <Loading />

	return (
		<>
			{loading2 && <Loading />}
			{ rate && <RatingComponent checkTicket={ checkTicket } /> }
			<title>Нархоз Университеті | Кезекке Тұру</title>
			<Header />
			<Wrapper additionalStyles='mx-auto min-h-screen mt-5 flex flex-col'>
				<Heading
					text={locales[lang].ticket.Title}
					additionalStyle='text-center'
				/>
				<Info text={locales[lang].ticket.Description} />
				<div
					className='h-[350px] relative flex items-center justify-center'
					onClick={() => handleTouch()}
				>
					<div
						className={`absolute inset-0 m-auto z-[-1] border-0 duration-1000 ${circleStyle}`}
					></div>
					<div className='flex flex-col justify-center items-center mb-10'>
						<p
							className={`flex w-full text-center justify-center font-black text-5xl mt-9 duration-1000 ${circleColor === 'black' ? 'text-white' : 'text-black'
								}`}
						>
							{data.ticket_number}
						</p>
						<p
							className={`flex w-full text-center justify-center font-black text-lg ${circleColor === 'black' ? 'text-white' : 'text-black'
								}`}
						>
							{locales[lang].ticket.TicketNumberText}
						</p>
					</div>
				</div>
				{/* <Ticket
					data={data}
					version={ticket_version}
					locales={{
						your_number: locales[lang].ticket.TicketNumberText,
						front_queue: locales[lang].ticket.FrontQueue,
						current_ticket: locales[lang].ticket.CurrentTicket,
					}}
				/> */}


				<p className='flex w-full text-center justify-center font-black text-lg'>
					{locales[lang].ticket.CurrentTicket}: {data.current_ticket}
				</p>
				<p className='flex w-full text-center justify-center font-black text-lg'>
					{locales[lang].ticket.FrontQueue}: {data.front_queue}
				</p>
				{/*<p className='flex w-full text-center justify-center font-black text-lg'>
					{locales[lang].ticket.waiting_time} {(() => {
						const totalMinutes =
							data.front_queue > 0
								? data.front_queue * data.average_duration +
								  data.average_duration
								: data.average_duration

						const hours = Math.floor(totalMinutes / 60)
						const minutes = Math.round(totalMinutes % 60) // Round to avoid floating numbers

						if (totalMinutes >= 60) {
							return `${hours}${lang == 'en' ? "h" : lang == 'ru' ? 'ч' : 'с'} ${minutes}${lang == 'en' ? "m" : 'м'}`
						} else {
							return `${minutes}${lang == 'en' ? "m" : 'м'}`
						}
					})()}
				</p>*/}
				<p className='flex w-full text-center justify-center font-black text-lg'>
					{data.ticket_created_time}
				</p>

				<TicketsStatus list={livelist} lang={lang} />
				<p className='flex justify-center text-center items-center mb-3 mt-2'>
					{locales[lang].ticket.DevEmail}
				</p>
				{ticket_version === 1 && (
					<form
						className='mx-auto w-full max-w-96 mt-5 px-5'
						onSubmit={handleCancelTicket}
					>
						<button
							type='button'
							className='bg-[#1da1f2] py-2 text-white rounded-lg w-full max-w-96 mb-5 px-3'
							onClick={() => setModal(!modal)}
						>
							{locales[lang].ticket.TurnOnNotification}
						</button>
						<button
							type='submit'
							className='bg-main py-2 text-white rounded-lg w-full max-w-96 mb-5 px-3'
						>
							{locales[lang].ticket.CancelTicket}
						</button>
					</form>
				)}

				<p className='mb-5 flex justify-center gap-1 items-center'>
					<Copyright width={16} height={16} />
					<span>{locales[lang].ticket.Copyright} 2024</span>
				</p>

				{modal && (
					<>
						<div
							className='fixed inset-0 bg-blur'
							onClick={() => setModal(!modal)}
						></div>
						<div
							className={`fixed bottom-0 left-0 right-0 max-w-96 bg-white mx-auto p-5 rounded-t-2xl flex-col  ${modal ? `flex ${styles.modal}` : 'none'
								}`}
						>
							<div className='bg-gray-500 h-1 w-10 mx-auto rounded-full mb-5'></div>
							<h2 className='text-xl font-semibold'>
								{locales[lang].ticket.TurnOnNotification}
							</h2>
							<Link
								target='_blank'
								href={`https://t.me/queue_narxoz_bot?start=${token_ticket}`}
								className='bg-[#1da1f2] w-full text-white py-2 rounded-xl flex items-center justify-center gap-1 mt-5'
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='25'
									height='25'
									viewBox='0 0 64 64'
								>
									<path
										d='M32,10c12.15,0,22,9.85,22,22s-9.85,22-22,22s-22-9.85-22-22S19.85,10,32,10z M39.589,40.968	c0.404-1.241,2.301-13.615,2.534-16.054c0.071-0.738-0.163-1.229-0.619-1.449c-0.553-0.265-1.371-0.133-2.322,0.21	c-1.303,0.47-17.958,7.541-18.92,7.951c-0.912,0.388-1.775,0.81-1.775,1.423c0,0.431,0.256,0.673,0.96,0.924	c0.732,0.261,2.577,0.82,3.668,1.121c1.05,0.29,2.243,0.038,2.913-0.378c0.709-0.441,8.901-5.921,9.488-6.402	c0.587-0.48,1.056,0.135,0.576,0.616c-0.48,0.48-6.102,5.937-6.844,6.693c-0.901,0.917-0.262,1.868,0.343,2.249	c0.689,0.435,5.649,3.761,6.396,4.295c0.747,0.534,1.504,0.776,2.198,0.776C38.879,42.942,39.244,42.028,39.589,40.968z'
										fill='#FFFFFF'
									></path>
								</svg>

								<p>Telegram</p>
							</Link>
						</div>
					</>
				)}
			</Wrapper>
		</>
	)
}
