'use client'

import StatusRow from '@/components/tickets-status/status-row'
import {
	isNewTicket,
	NewTicketWrapper,
	WebSocketMessage,
} from '@/types/websocket'
import {
	disconnectSocket,
	initiateSocket,
	subscribeToEvent,
} from '@/utils/websocket'
import { useEffect, useState } from 'react'
import orderSound from './sound.mp3'

interface StatusRowCard {
	active: boolean
	number: string
	window: number
}

export default function Page() {
	const [data, setData] = useState<StatusRowCard[]>([])

	useEffect(() => {
		const sound = new Audio(orderSound)

		initiateSocket(() => {
			console.log('WebSocket connected')
		})

		const handleEvent = (dataa: WebSocketMessage) => {
			if (dataa.action! == 'next_ticket') {
				const data5 = dataa.data as NewTicketWrapper
				const newCard: StatusRowCard = {
					active: true,
					number: data5.ticket.number,
					window: data5.window!,
				}
				setData(prevData => {
					const updatedData = [newCard, ...prevData]

					if (updatedData.length > 10) {
						updatedData.pop()
					}

					return updatedData.map(item =>
						item.window === data5.window && item.number !== newCard.number
							? { ...item, active: false }
							: item
					)
				})
				sound.play()
			}

			if (
				dataa.action === 'complete_ticket' ||
				dataa.action === 'skip_ticket'
			) {
				setData(prevList =>
					prevList.map(item => {
						const a = dataa.data as NewTicketWrapper
						const ticketNumber = isNewTicket(dataa.data)
							? dataa.data.number
							: a.ticket.number
						return item.number === ticketNumber
							? { ...item, active: false }
							: item
					})
				)
				// Play the sound here
			}
		}

		subscribeToEvent(handleEvent)

		return () => {
			disconnectSocket()
		}
	}, [])

	return (
		<div className='w-full h-screen flex flex-col items-center p-5 bg-header-bg'>
			<div className='w-full h-full flex-grow flex flex-row items-center overflow-y-auto bg-gray-100 rounded-lg'>
				<div className='w-1/2 h-full flex flex-col items-center px-4'>
					<div className='w-full flex justify-between items-center max-h-14 h-14 bg-gray-300 px-2 mt-2 rounded'>
						<span className='text-2xl font-bold'>Нөмір | Номер</span>
						<span className='text-2xl font-bold'>Терезе | Окно</span>
					</div>
					<div className='status w-full h-full flex flex-col justify-start gap-5'>
						{data.slice(0, 5).map((item, index) => (
							<StatusRow
								key={index}
								active={item.active}
								number={item.number}
								window={item.window}
								customStyle={`${
									!item.active ? 'bg-gray-300' : ''
								} h-1/6 flex flex-row items-center text-5xl font-bold`}
							/>
						))}
					</div>
				</div>

				<div className='w-1/2 h-full flex flex-col items-center px-4'>
					<div className='w-full flex justify-between items-center max-h-14 h-14 bg-gray-300 px-2 mt-2 rounded'>
						<span className='text-2xl font-bold'>Нөмір | Номер</span>
						<span className='text-2xl font-bold'>Терезе | Окно</span>
					</div>
					<div className='status w-full h-full flex flex-col gap-5'>
						{data.slice(5).map((item, index) => (
							<StatusRow
								key={index}
								active={item.active}
								number={item.number}
								window={item.window}
								customStyle={`${
									!item.active ? 'bg-gray-300' : ''
								} h-1/6 flex flex-row items-center text-5xl font-bold`}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
