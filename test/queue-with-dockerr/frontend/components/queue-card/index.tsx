import { getCookie, setCookie } from '@/actions/set-cookie'
import urlCreator from '@/utils/url-creator'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface QueueCardProps {
	data: {
		id: number
		name: string
		queue: number
	}
	text: string
	setLoading: (e: boolean) => void
}

const QueueCard: React.FC<QueueCardProps> = ({
	data: { id, name, queue },
	text,
	setLoading,
}) => {
	const router = useRouter()

	const handleFetchTicket = async () => {
		setLoading(true)
		const phone_number = await getCookie('phone_number')
		const full_name = await getCookie('full_name')
		const lang = await getCookie('lang')
		try {
			const response = await fetch(urlCreator('ticket/'), {
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({
					phone_number: phone_number,
					full_name: full_name,
					category_id: id,
					language: lang,
				}),
			})
			const data = await response.json()
			if (!response.ok) {
				throw new Error('Failed to fetch ticket')
			}
			if (response.ok) {
				await setCookie('ticket_id', data.id)
				await setCookie('cid', data.category_id)
				router.push('/ticket')
			}
		} catch (error) {
			console.error('Error fetching data:', error)
		} finally {
			setLoading(false)
		}
	}
	return (
		<div
			className='bg-main w-full max-w-96 p-5 rounded text-white flex gap-5 mt-5 items-center'
			onClick={handleFetchTicket}
		>
			<Image alt='List icon' src={'/list.svg'} width={32} height={32} />
			<div className='flex flex-col'>
				<h2 className='text-xl font-medium'>{name}</h2>
				<p className='flex flex-row gap-2 items-center'>
					<span className='text-sm'>{text}: </span>
					<span className='p-1 px-2 bg-yellow rounded-3xl text-sm'>
						{queue}
					</span>
				</p>
			</div>
		</div>
	)
}

export default QueueCard
