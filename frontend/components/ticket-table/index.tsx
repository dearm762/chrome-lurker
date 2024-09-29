import { Ticket } from '@/app/(staff)/users/[id]/page'
import locales from '@/locales/common.json'
import { Language } from '@/types/lang'

interface props {
	lang: Language
	data: Ticket[]
}
export default function TicketTable({ lang, data }: props) {
	return (
		<div className='overflow-y-scroll max-h-[450px]'>
			<table className='table table-zebra table-pin-rows max-h-1/3'>
				<thead>
					<tr>
						<th>{data.length}</th>
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
					{data &&
						data.map((ticket, index) => (
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
	)
}
