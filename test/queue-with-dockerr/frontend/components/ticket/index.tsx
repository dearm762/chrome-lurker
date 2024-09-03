import React from 'react'
import styles from './styles.module.sass'

interface Props {
	data: {
		ticket_number: number
		front_queue: number
		current_ticket: string
		ticket_created_time: string
	},
	locales:{
		your_number: string,
		front_queue: string,
		current_ticket: string
	}
	version?: number
}

const Ticket: React.FC<Props> = ({ data,locales, version = 1 }) => {
	return (
		<div className={version == 1 ? styles.ticket_v1 : styles.ticket_v2}>
			<p className='text-5xl font-semibold mt-3'>{data.ticket_number}</p>
			<p className='font-medium'>{locales.your_number}</p>

			<div className="max-w-72 w-72 border-dashed border-[1px] mt-10 mb-2"></div>

			<p className={`flex justify-between w-full max-w-72  ${version == 1 ? 'text-grayer' : 'text-white' } `}>
				<span className='text-sm'>{locales.front_queue}</span>
				<span className='text-sm '>{data.front_queue}</span>
			</p>
			<div className="max-w-72 w-72 border-dashed border-[1px] mt-2 mb-2"></div>

			<p className={`flex justify-between w-full max-w-72 ${version == 1 ? 'text-grayer' : 'text-white' } `}>
				<span className='text-sm'>{locales.current_ticket}</span>
				<span className='text-sm'>{data.current_ticket}</span>
			</p>
			<div className="max-w-72 w-72 border-dashed border-[1px] mt-2"></div>

			<time className='flex justify-between w-full max-w-72 mt-10 mb-20 font-semibold'>
				<span className='text-sm'>{data.ticket_created_time.split(' ')[0]}</span>
				<span className='text-sm'>{data.ticket_created_time.split(' ')[1]}</span>
			</time>
		</div>
	)
}

export default Ticket