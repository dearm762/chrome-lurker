import Image from 'next/image'
import Heading from '../text/heading'
import Info from '../text/info'

interface DashboardCardProps {
	image: string
	bg: string
	data: {
		count: number | string
		title: string
	}
	additionalStyle?: string
}


export default function DashboardCard({ image, data: { title, count }, bg, additionalStyle }: DashboardCardProps) {
	return (
		<div className={`flex gap-4 items-center bg-white p-5 py-7 rounded-lg shadow-custom ${additionalStyle ?? additionalStyle}`}>
			<Image alt='' src={image} width={60} height={60} className={'rounded p-1'} style={{ backgroundColor: bg }} />
			<div>
				<Heading text={String(count)} additionalStyle='text-3xl' />
				<Info text={title} additionalStyle='text-lg' />
			</div>
		</div>
	)
}
