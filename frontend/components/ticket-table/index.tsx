'use client'

import { Ticket } from '@/app/(staff)/users/[id]/page'
import locales from '@/locales/common.json'
import { Language } from '@/types/lang'
import { useState, useMemo } from 'react'

interface Props {
	lang: Language
	data: Ticket[],
	period: '1_day' | '1_week' | '1_month'
	setPeriod: React.Dispatch<React.SetStateAction<"1_day" | "1_week" | "1_month">>
}

export default function TicketTable({ lang, data, period, setPeriod }: Props) {
	const [searchFilter, setSearchFilter] = useState('')
	const [rateFilter, setRateFilter] = useState('')

	const filteredData = useMemo(() => {
		return data.filter((ticket) => {
			const searchMatch =
				searchFilter === '' ||
				ticket.full_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
				ticket.phone_number.includes(searchFilter) ||
				ticket.number.toLowerCase().includes(searchFilter.toLowerCase())

			const rateMatch =
				rateFilter === '' ||
				(rateFilter === 'null' && ticket.rate === null) ||
				ticket.rate?.toString() === rateFilter

			return searchMatch && rateMatch
		})
	}, [data, searchFilter, rateFilter])

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center gap-2">
				<input
					type="text"
					placeholder={`${locales[lang].user.Table.TicketFullName}, ${locales[lang].user.Table.TicketPhoneNumber}, ${locales[lang].user.Table.TicketNumber}`}
					className="input input-bordered flex-grow min-w-[300px] h-12"
					value={searchFilter}
					onChange={(e) => setSearchFilter(e.target.value)}
				/>
				<select
					className="select select-bordered h-12"
					value={rateFilter}
					onChange={(e) => setRateFilter(e.target.value)}
				>
					<option value="">All Rates</option>
					<option value="5">5 Stars</option>
					<option value="4">4 Stars</option>
					<option value="3">3 Stars</option>
					<option value="2">2 Stars</option>
					<option value="1">1 Star</option>
					<option value="null">Not Rated</option>
				</select>
				<select
					className="select select-bordered h-12"
					value={period}
					onChange={(e) => setPeriod(e.target.value as '1_day' | '1_week' | '1_month')}
				>
					<option value="1_day">1 Day</option>
					<option value="1_week">1 Week</option>
					<option value="1_month">1 Month</option>
				</select>
			</div>
			<div className='overflow-y-scroll max-h-[450px]'>
				<table className='table table-zebra table-pin-rows max-h-1/3 w-full'>
					<thead>
						<tr>
							<th>{filteredData.length}</th>
							<th>{locales[lang].user.Table.TicketFullName}</th>
							<th>{locales[lang].user.Table.TicketPhoneNumber}</th>
							<th>{locales[lang].user.Table.TicketNumber}</th>
							<th>{locales[lang].user.Table.TicketCreateAt}</th>
							<th>{locales[lang].user.Table.TicketLanguage}</th>
							<th>{locales[lang].user.Table.TicketStatus}</th>
							<th>Rate</th>
						</tr>
					</thead>
					<tbody>
						{filteredData.map((ticket, index) => (
							<tr
								key={ticket.id}
								className={`${ticket.status == 'invited' && 'bg-gray-500'}`}
							>
								<th>{index + 1}</th>
								<td>{ticket.full_name}</td>
								<td>{ticket.phone_number}</td>
								<td>{ticket.number}</td>
								<td>{ticket.created_at}</td>
								<td>{locales[lang].languages[ticket.language as Language]}</td>
								<td>
									{
										locales[lang].user[
										(ticket.status as 'skipped') || 'completed' || 'invited'
										]
									}
								</td>
								<td>{ticket?.rate === null ? 'null' : ticket.rate}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
