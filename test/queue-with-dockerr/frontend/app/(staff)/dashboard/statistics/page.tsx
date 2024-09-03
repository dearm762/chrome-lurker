'use client'

import { getLanguage } from '@/actions/set-cookie'
import DashboardHeader from '@/components/header/dashboard'
import StatisticCard from '@/components/statistic-card'
import Heading from '@/components/text/heading'
import Loading from '@/components/wrapper/loading'
import { Language } from '@/types/lang'
import { StatisticResponse } from '@/types/statistic-page'
import urlCreator from '@/utils/url-creator'
import { useEffect, useState } from 'react'
import locales from '@/locales/common.json'

export default function Statistics() {
	const [data, setData] = useState<StatisticResponse>()
	const [loading, setLoading] = useState<boolean>(true)
	const [loading2, setLoading2] = useState<boolean>(false)
	const [lang, setLanguage] = useState<Language>('ru')

	const getLang = async () => {setLanguage(await getLanguage()),setLoading(false)}

	const fetchData = async () => {
		try {
			const response = await fetch(urlCreator('interface/admin/statistics'))
			const data = await response.json()
			if (response.ok) {
				setData(data)
				console.log(data)
			} else {
				console.error('Failed to fetch data:', response.status)
			}
		} catch (err) {
			console.error(err)
		} 
	}
	useEffect(() => {
		fetchData()
		getLang()
	}, [])

	if (loading) {
		return <Loading />
	}
	return (
		<>
			<title>Narxoz e-kezek | statistics</title>
			{
				loading2 && <Loading />
			}
			<DashboardHeader setIsLoading={setLoading2}/>
			<div className='w-full max-w-[1280px] mx-auto flex flex-col pt-10 mt-20 gap-5'>
				<Heading text={locales[lang].statistic.general_text}/>
				<div className='w-full flex flex-wrap gap-3'>
					<StatisticCard
					lang={lang}
						addotionalStyle='shadow bg-main text-white'
						color=''
						data={data?.general_data!}
					/>
				</div>
				<Heading text={locales[lang].statistic.categoey_text}/>
				<div className='w-full flex flex-wrap gap-3'>
					{data?.categories! &&
						data?.categories.map((category, index) => (
							<StatisticCard
					lang={lang}
					key={index}
								addotionalStyle='shadow bg-main text-white'
								color=''
								data={category}
							/>
						))}
				</div>
			</div>
		</>
	)
}
