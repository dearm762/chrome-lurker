'use client'

import { getLanguage } from '@/actions/set-cookie'
import DashboardHeader from '@/components/header/dashboard'
import Heading from '@/components/text/heading'
import { Language } from '@/types/lang'
import { ArchiveX } from 'lucide-react'
import { useEffect, useState } from 'react'
import locales from '@/locales/common.json'
import Loading from '@/components/wrapper/loading'

export default function Page() {
	const [lang, setLanguage] = useState<Language>('ru')
	const [loading, setLoading] = useState<boolean>(true)

	const getLang = async () => { setLanguage(await getLanguage()), setLoading(false) } // !!!

	useEffect(() => {
		getLang()
	}, [])

	if (loading) {
		return <Loading />
	}

	return (
		<>
			<title>QUEUE NARXOZ | DASHBOARD</title>
			<meta
				name='description'
				content='Dashboard for narxoz queue operators.'
			/>
			<DashboardHeader />
			<div className='min-h-screen flex flex-col bg-[#F2F2F2] justify-center items-center'>
				<ArchiveX height={120} width={120} color='#d50032' />
				<Heading
					text={locales[lang]['invalid-page']['first-line']}
					additionalStyle='font-black text-center'
				/>
				<Heading text={locales[lang]['invalid-page']['second-line']} additionalStyle='mt-1' />
			</div>
		</>
	)
}
