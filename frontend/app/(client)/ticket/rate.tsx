import { useState } from 'react'
import Heading from '@/components/text/heading'
import Info from '@/components/text/info'
import { Star } from 'lucide-react'
import urlCreator from '@/utils/url-creator'
import Loading from '@/components/wrapper/loading'
import { getCookie } from '@/actions/set-cookie'

const RatingComponent = ({ checkTicket }: { checkTicket: () => void }) => {
	const [rating, setRating] = useState(0)
	const [loading, setLoading] = useState(false)

	const handleClick = (num: number) => setRating(num)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setLoading(true)
		const ticket_id = await getCookie('ticket_id')
		await fetch(urlCreator(`ticket/rate/${ticket_id}`), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ rating }),
		}).then(() => checkTicket())
	}

	return (
		<form className='fixed inset-0 bg-white z-50 flex flex-col gap-2' onSubmit={handleSubmit}>
			<Heading
				text='Thanks for appealing'
				additionalStyle='text-center mt-60'
			/>
			<Info
				text='Please, rate the customer service:'
				additionalStyle='font-medium'
			/>
			<div className='mx-auto mt-5 flex gap-[2px]'>
				{
					[1, 2, 3, 4, 5].map((num) => (
						<button
							key={num}
							onClick={(e) => {
								e.stopPropagation()
								handleClick(num)
							}}
							className={`p-2 transition-colors duration-75 ${rating >= num ? 'text-black' : 'text-gray-300'}`}
							type='button'
							aria-label={`Rate ${num} star`}
						>
							<Star className='w-10 h-10' fill={rating >= num ? 'black' : 'none'} />
						</button>
					))
				}
			</div>
			<p className='text-center -mt-3 font-medium'>You rated: {rating}/5</p>
			<button type='submit' className="bg-black text-white font-medium py-2 px-4 rounded hover:bg-gray-800 transition duration-200 max-w-sm mt-auto mb-5 w-[90%] mx-auto">
				{loading ? <Loading /> : <span>Send</span>}
			</button>
		</form>
	)
}

export default RatingComponent
