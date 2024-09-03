import { getCookie, getLanguage, setCookie } from '@/actions/set-cookie'
import DashboardCard from '@/components/dashboard-card'
import Heading from '@/components/text/heading'
import locales from '@/locales/common.json'
import { Language } from '@/types/lang'
import {
	NewTicket,
	NewTicketWrapper,
	WebSocketMessage,
} from '@/types/websocket'
import { CurrentTicket, Data } from '@/types/worker-dashboard-page'
import urlCreator from '@/utils/url-creator'
import {
	disconnectSocket,
	initiateSocket,
	subscribeToEvent,
} from '@/utils/websocket'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardHeader from '../header/dashboard'
import Alert from '../wrapper/Alert'
import Loading from '../wrapper/loading'
import styles from './ticket.module.sass'

const DashboardStaff = () => {
	const [data, setData] = useState<Data>()
	const [loading, setLoading] = useState<boolean>(true)
	const [loading2, setLoading2] = useState<boolean>(false)
	const [current, setCurrent] = useState<CurrentTicket>({
		ticket_data: null,
		ticket_id: 0,
		ticket_number: 0,
		category_name: '',
		ticket_created_time: '',
		ticket_language: '',
		ticket_phone_number: '',
		ticket_full_name: '',
	})
	const router = useRouter()
	const [lang, setLanguage] = useState<Language>('ru')
	const [status, setStatus] = useState<boolean>(false)

	const [alert, setAlert] = useState({ type: '', message: '', visible: false })

	const showAlert = (type: string, message: string) => {
		setAlert({ type, message, visible: true })
	}

	const hideAlert = () => {
		setAlert({ ...alert, visible: false })
	}

	const fetchData = async () => {
		try {
			const token = await getCookie('token')
			const response = await fetch(urlCreator(`interface/worker/dashboard`), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token }),
			})

			if (response.ok) {
				const data = await response.json()
				setData(data)
				setCookie('category_id', data?.personal_data.user.category_id)
				if (data.current_ticket == null) {
					setCurrent({
						ticket_data: null,
						ticket_id: 0,
						ticket_number: 0,
						category_name: '',
						ticket_created_time: '',
						ticket_language: '',
						ticket_phone_number: '',
						ticket_full_name: '',
					})
				} else {
					setCurrent(data.current_ticket)
				}
				console.log(data)
			} else {
				console.error('Failed to fetch data')
			}
		} catch (e) {
			console.error(e)
		} finally {
			setLoading(false)
		}
	}

	const handleNextButton = async () => {
		try {
			setLoading2(true)
			const token = await getCookie('token')
			const response = await fetch(urlCreator('category/ticket/next'), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token }),
			})

			if (response.status === 200) {
				const data = await response.json()
				setCurrent(data)
			}
			if (response.status === 404) {
				showAlert('error', locales[lang].staffDashboard['alert-not-found'])
				setCurrent({
					ticket_data: null,
					ticket_id: 0,
					ticket_number: 0,
					category_name: '',
					ticket_created_time: '',
					ticket_language: '',
					ticket_phone_number: '', // Updated here
					ticket_full_name: '',
				})
			}
		} catch (e) {
			console.error(e)
		} finally {
			setLoading2(false)
		}
	}
	const handleSkipButton = async () => {
		try {
			setLoading2(true)
			const token = await getCookie('token')
			const response = await fetch(urlCreator('ticket/skip'), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token }),
			})

			if (response.ok) {
				const data = await response.json()
				setCurrent(data)
			}
			if (response.status === 404) {
				showAlert('error', locales[lang].staffDashboard['alert-not-found'])
				setCurrent({
					ticket_data: null,
					ticket_id: 0,
					ticket_number: 0,
					category_name: '',
					ticket_created_time: '',
					ticket_language: '',
					ticket_phone_number: '', // Updated here
					ticket_full_name: '', // Updated here
				})
			}
		} catch (e) {
			console.error(e)
		} finally {
			setLoading2(false)
		}
	}

	const new_ticket = async (data: WebSocketMessage) => {
		const category_id = await getCookie('category_id')
		if (
			data.action === 'new_ticket' &&
			data.category_id == parseInt(category_id!)
		) {
			setData(prevData => ({
				...prevData!,
				general_data: {
					...prevData!.general_data!,
					clients_in_queue: 1 + (prevData?.general_data?.clients_in_queue || 0),
				},
			}))
		}
	}

	const next_ticket = async (dataa: WebSocketMessage) => {
		const category_id = await getCookie('category_id')
		const token_id = await getCookie('token_id')
		if (
			dataa.action === 'next_ticket' &&
			dataa.category_id == parseInt(category_id!)
		) {
			setData(prevData => ({
				...prevData!,
				general_data: {
					...prevData!.general_data!,
					accepted_today: (prevData?.general_data?.accepted_today || 0) + 1,
					clients_in_queue: (prevData?.general_data?.clients_in_queue || 0) - 1,
				},
			}))
			const new_ticket_wrapper = dataa.data as NewTicketWrapper
			if (
				new_ticket_wrapper.ticket.worker_id == parseInt(token_id!) &&
				dataa.action === 'next_ticket'
			) {
				setData(prevData => ({
					...prevData!,
					personal_data: {
						...prevData!.personal_data,
						accepted_today: 1 + (prevData?.personal_data?.accepted_today || 0),
					},
				}))
			}
		}
	}

	const complete_ticket = async (dataa: WebSocketMessage) => {
		const category_id = await getCookie('category_id')
		const token_id = await getCookie('token_id')
		if (
			dataa.action === 'complete_ticket' &&
			dataa.category_id == parseInt(category_id!)
		) {
			setData(prevData => ({
				...prevData!,
				general_data: {
					...prevData!.general_data,
					served_today: 1 + (prevData?.general_data?.served_today || 0),
				},
			}))
		}
		const completed_ticket_wrapper = dataa.data! as NewTicket
		if (
			completed_ticket_wrapper.worker_id == parseInt(token_id!) &&
			dataa.action === 'complete_ticket'
		) {
			setData(prevData => ({
				...prevData!,
				personal_data: {
					...prevData!.personal_data,
					served_today: 1 + (prevData?.personal_data?.served_today || 0),
				},
			}))
		}
	}

	const skip_ticket = async (dataa: WebSocketMessage) => {
		const category_id = await getCookie('category_id')
		const token_id = await getCookie('token_id')
		const skipped_ticket_wrapper = dataa.data! as NewTicket
		if (
			skipped_ticket_wrapper.worker_id == parseInt(token_id!) &&
			dataa.action === 'skip_ticket' &&
			dataa.category_id == parseInt(category_id!)
		) {
			setData(prevData => ({
				...prevData!,
				personal_data: {
					...prevData!.personal_data,
					skipped_today: 1 + (prevData?.personal_data?.skipped_today || 0),
				},
			}))
		}
	}

	const cancel_ticket = async (dataa: WebSocketMessage) => {
		const category_id = await getCookie('category_id')
		const token_id = await getCookie('token_id')
		const cancelled_ticket_wrapper = dataa.data! as NewTicket
		if (
			dataa.action == 'update_ticket' &&
			cancelled_ticket_wrapper.status == 'cancelled' &&
			dataa.category_id == parseInt(category_id!)
		) {
			setData(prevData => ({
				...prevData!,
				general_data: {
					...prevData!.general_data,
					clients_in_queue: (prevData?.general_data?.clients_in_queue || 0) - 1,
				},
			}))
		}
	}

	const getLang = async () => {
		setLanguage(await getLanguage())
	}
	useEffect(() => {
		getLang()
		fetchData()
		initiateSocket(setStatus)

		subscribeToEvent((dataa: WebSocketMessage) => {
			console.log(dataa)
			next_ticket(dataa)
			complete_ticket(dataa)
			new_ticket(dataa)
			skip_ticket(dataa)
			cancel_ticket(dataa)
		})

		return () => {
			disconnectSocket()
		}
	}, [])

	if (loading) {
		return <Loading />
	}
	return (
		<>
			<title>QUEUE NARXOZ | DASHBOARD</title>
			<meta
				name='description'
				content='Dashboard for narxoz queue operators.'
			/>
			{loading2 && <Loading />}
			<DashboardHeader setIsLoading={setLoading2} />
			{alert.visible && (
				<Alert type={alert.type} message={alert.message} onClose={hideAlert} />
			)}

			<div className='min-h-screen pt-32 bg-[#F2F2F2]'>
				<div className='w-full max-w-[1280px] mx-auto flex flex-col pt-10'>
					<Heading
						text={`${locales[lang].staffDashboard.MainText} | ${data?.category_name}`}
					/>
					<section className='w-full max-w-[1050px] mx-auto mt-5'>
						<Heading text={locales[lang].staffDashboard.PersonalData} />
						<div className='flex gap-5 mt-5'>
							<div className='grow flex flex-col w-full max-w-[380px] gap-5'>
								<DashboardCard
									image='/dashboard/Information-circle.svg'
									data={{
										title: locales[lang].staffDashboard.WindowNumber,
										count: '№ ' + data?.personal_data.user.window,
									}}
									bg={'#D02CE3'}
								/>
								<DashboardCard
									image='/dashboard/alert-triangle.svg'
									data={{
										title: locales[lang].staffDashboard.SkippedToday,
										count: '' + data?.personal_data.skipped_today,
									}}
									bg={'#F13446'}
								/>
								<button
									onClick={handleSkipButton}
									className='bg-main py-3 rounded-md text-white flex justify-center gap-2 hover:bg-red-600 duration-100 mt-auto mb-3 text-xl font-light'
								>
									<span>
										{locales[lang].staffDashboard.SkipMaintenanceButton}
									</span>
									<ArrowRight />
								</button>
							</div>
							<div className='grow flex flex-col w-full max-w-[380px] gap-5'>
								<DashboardCard
									image='/dashboard/Group-person.svg'
									data={{
										title: locales[lang].staffDashboard.AcceptedToday,
										count: '' + data?.personal_data.accepted_today,
									}}
									bg={'#008742'}
								/>
								<DashboardCard
									image='/dashboard/Two-Person.svg'
									data={{
										title: locales[lang].staffDashboard.ServedToday,
										count: '' + data?.personal_data.served_today,
									}}
									bg={'#0D8EFF'}
								/>
								<button
									onClick={handleNextButton}
									className='bg-green-500 py-3 rounded-md text-white flex justify-center gap-2 hover:bg-green-600 duration-100 mt-auto mb-3 text-xl font-light'
								>
									<span>
										{current.ticket_data
											? locales[lang].staffDashboard.EndMaintenanceButton
											: locales[lang].staffDashboard.StartMaintenanceButton}
									</span>
									<ArrowRight />
								</button>
							</div>
							<div className='grow flex flex-col w-full max-w-[380px] gap-5'>
								<div className={styles.ticket}>
									<Heading
										text={`${locales[lang].staffDashboard.TicketClient} №`}
									/>
									<p className='text-5xl font-semibold mt-2'>
										{current.ticket_number}
									</p>

									<p className='flex justify-between w-full max-w-[260px] border-dashed border-b-[1px] mt-10 mb-3 pb-1'>
										<span>
											{locales[lang].staffDashboard.TicketMaintenance}:
										</span>
										<span className={ styles.singleLine }>
											{current.category_name}
										</span>
									</p>
									<p className='flex justify-between w-full max-w-[260px] border-dashed border-b-[1px] mb-3 pb-1'>
										<span className='text=[#77797B]'>
											{locales[lang].staffDashboard.TicketCreateAt}:
										</span>
										<span>{current.ticket_created_time}</span>
									</p>
									<p className='flex justify-between w-full max-w-[260px] border-dashed border-b-[1px] mb-3 pb-1'>
										<span className='text=[#77797B]'>
											{locales[lang].staffDashboard.TicketLanguage}:
										</span>
										<span>
											{
												locales[lang].languages[
													current.ticket_language as Language
												]
											}
										</span>
									</p>
									<p className='flex justify-between w-full max-w-[260px] border-dashed border-b-[1px] mb-3 pb-1'>
										<span className='text=[#77797B]'>
											{locales[lang].staffDashboard.TicketPhoneNumber}:
										</span>
										<span>{current.ticket_phone_number}</span>
									</p>
									<p className='flex justify-between w-full max-w-[260px] border-dashed border-b-[1px] pb-1'>
										<span className='text=[#77797B]'>
											{locales[lang].staffDashboard.TicketFullName}:
										</span>
										<span>{current.ticket_full_name}</span>
									</p>
								</div>
							</div>
						</div>
					</section>
					<section className='w-full max-w-[1050px] mx-auto mt-5'>
						<Heading text={locales[lang].staffDashboard.GeneralData} />
						<div className='flex gap-5 mt-5'>
							<DashboardCard
								image='/dashboard/Information-circle.svg'
								data={{
									title: locales[lang].staffDashboard.QueueClients,
									count: '' + data?.general_data.clients_in_queue,
								}}
								bg={'#D02CE3'}
								additionalStyle='w-[336px]'
							/>
							<DashboardCard
								image='/dashboard/Group-person.svg'
								data={{
									title: locales[lang].staffDashboard.AcceptedToday,
									count: '' + data?.general_data.accepted_today,
								}}
								bg={'#008742'}
								additionalStyle='w-[336px]'
							/>
							<DashboardCard
								image='/dashboard/Two-Person.svg'
								data={{
									title: locales[lang].staffDashboard.ServedToday,
									count: '' + data?.general_data.served_today,
								}}
								bg={'#0D8EFF'}
								additionalStyle='w-[336px]'
							/>
						</div>
					</section>
					<div
						className={`absolute w-[5px] h-[5px] top-5 right-5 rounded-lg ${
							status ? 'bg-green-500' : 'bg-red-500'
						}`}
					/>
				</div>
			</div>
		</>
	)
}

export default DashboardStaff
