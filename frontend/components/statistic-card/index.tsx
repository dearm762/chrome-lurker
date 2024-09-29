import { Language } from '@/types/lang'
import locales from '@/locales/common.json'

type data = {
	category_name: string

	accepted_today: number
	cancelled_today: number
	passed_today: number
	serviced_today: number

	serviced_all_time: number
	accepted_all_time: number
}

type props = {
	data?: data
	color?: string
	addotionalStyle?: string,
	lang: Language
}

const StatisticCard = ({ color = 'yellow', data, addotionalStyle, lang }: props) => {
	return (
		<div
			className={`w-[414px] p-5 rounded-xl flex flex-col gap-3 ${addotionalStyle}`}
			style={{ backgroundColor: color }}
		>
			<p className='text-2xl font-black pb-2'>{data?.category_name}</p>
			<p className='flex justify-between'>
				<span className=''>{data?.accepted_today}</span>
				<span className=''>{locales[lang].statistic.accepted_today}</span>
			</p>
			{/* <p className='flex justify-between'>
							<span className='text-xl'>6:03</span>
							<span className='text-xl'> средний время обслуживаний (минуты)</span>
							</p> */}
			<p className='flex justify-between'>
				<span className=''>{data?.serviced_today}</span>
				<span className=''> {locales[lang].statistic.serviced_today}</span>
			</p>
			<p className='flex justify-between'>
				<span className=''>{data?.cancelled_today}</span>
				<span className=''> {locales[lang].statistic.cancelled_today}</span>
			</p>
			<p className='flex justify-between'>
				<span className=''>{data?.passed_today}</span>
				<span className=''> {locales[lang].statistic.passed_today}</span>
			</p>

			<p className='flex justify-between'>
				<span className=''>{data?.accepted_all_time}</span>
				<span className=''> {locales[lang].statistic.accepted_all_time}</span>
			</p>
			<p className='flex justify-between'>
				<span className=''>{data?.serviced_all_time}</span>
				<span className=''>{locales[lang].statistic.serviced_all_time}</span>
				</p>
		</div>
	)
}

export default StatisticCard
