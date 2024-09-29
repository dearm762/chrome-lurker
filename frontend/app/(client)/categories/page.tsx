'use client'

import { deleteCookie, getLanguage } from '@/actions/set-cookie'
import { catefories } from '@/types/categories-page'
import urlCreator from '@/utils/url-creator'
import Image from 'next/image'
import { Fragment, useEffect, useState } from 'react'

import Header from '@/components/header'
import QueueCard from '@/components/queue-card'
import Heading from '@/components/text/heading'
import Info from '@/components/text/info'
import Wrapper from '@/components/wrapper'
import { Language } from '@/types/lang'

import Loading from '@/components/wrapper/loading'
import locales from '@/locales/common.json'
import { useRouter } from 'next/navigation'

export default function Page() {
	const [data, setData] = useState<catefories[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [loading2, setLoading2] = useState<boolean>(false)
	const [lang, setLanguage] = useState<Language>('ru')
	const router = useRouter()

	const fetchData = async () => {
		setLoading(true)
		try {
			const response = await fetch(urlCreator('interface/client/categories'))
			const data = await response.json()
			setData(data)
		} catch (error) {
			console.error('Error fetching data:', error)
		} finally {
			setLoading(false)
		}
	}

	const get_workTime = async () => {
		const response = await fetch(urlCreator('setting/'), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			const data = await response.json()
			const { permission } = data
			console.log(permission)
			if (!permission) {
				await deleteCookie('ticket_id')
				await deleteCookie('full_name')
				await deleteCookie('phone_number')
				await deleteCookie('cid')
				router.replace('/')
			}
	}

	const getLang = async () => {
		setLanguage(await getLanguage())
	}

	useEffect(() => {
		get_workTime()
		getLang()
		fetchData()
	}, [])

	if (loading) {
		return <Loading />
	}

	return (
		<>
			{loading2 && <Loading />}
			<title>Нархоз Университеті | Кезекке Тұру</title>
			<meta name='theme-color' content='#ff6600'></meta>
			<Header />
			<Wrapper additionalStyles='mx-auto min-h-screen flex flex-col items-center mt-8 px-5'>
				<Image alt='' src={'/queue.svg'} width={72} height={68} />
				<Heading text={locales[lang].categories.Main} additionalStyle='mt-7' />
				<Info text={locales[lang].categories.Description} />

				<Fragment>
					{data.length > 0 &&
						data.map(card => (
							<QueueCard
								key={card.id}
								data={card}
								text={locales[lang].categories.queueText}
								setLoading={(e: boolean) => setLoading2(e)}
							/>
						))}
				</Fragment>
			</Wrapper>
		</>
	)
}
