import React from 'react'
import locales from '@/locales/common.json'
import { Language } from '@/types/lang'

export type StatisticData = {
	accepted_last_month: number
	skipped_last_month: number
	served_last_month: number
}

export interface StatisticMiniCardProps {
	data: StatisticData
	lang: Language
}

const StatisticMiniCard: React.FC<StatisticMiniCardProps> = ({ data, lang }) => {
	return (
		<div className='stats shadow w-full'>
			<div className='stat'>
				<div className='stat-figure text-secondary'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						className='inline-block h-8 w-8 stroke-current'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
						></path>
					</svg>
				</div>
				<div className='stat-title'>{locales[lang].user.statistic.accepted}</div>
				<div className='stat-value'>{data.accepted_last_month}</div>
				<div className='stat-title'>{locales[lang].user.statistic.date}</div>
			</div>

			<div className='stat'>
				<div className='stat-figure text-secondary'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						className='inline-block h-8 w-8 stroke-current'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
						></path>
					</svg>
				</div>
				<div className='stat-title'>{locales[lang].user.statistic.skipped}</div>
				<div className='stat-value'>{data.skipped_last_month}</div>
				<div className='stat-title'>{locales[lang].user.statistic.date}</div>
			</div>

			<div className='stat'>
				<div className='stat-figure text-secondary'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						className='inline-block h-8 w-8 stroke-current'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
						></path>
					</svg>
				</div>
				<div className='stat-title'>{locales[lang].user.statistic.served}</div>
				<div className='stat-value'>{data.served_last_month}</div>
				<div className='stat-title'>{locales[lang].user.statistic.date}</div>
			</div>
		</div>
	)
}

export default StatisticMiniCard