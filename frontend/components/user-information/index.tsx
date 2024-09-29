import { User } from '@/app/(staff)/users/[id]/page'
import { Language } from '@/types/lang'

export default function UserInformation({
	locales,
	lang,
	memoizedData,
	rate
}: {
	locales: any
	lang: Language
	memoizedData: User
	rate: number | null | undefined
}) {
	return (
		<div className='min-w-[500px] p-5 bg-white max-w-xl rounded-lg flex flex-col gap-2 mt-5 shadow w1/2'>
			<div className='info'>
				<span className='font-black text-2xl'>
					{locales[lang].user.FirstName}:{' '}
				</span>
				<span className='font-black text-2xl'>{memoizedData?.first_name}</span>
			</div>
			<div className='info'>
				<span className='font-black text-2xl'>
					{locales[lang].user.LastName}:{' '}
				</span>
				<span className='font-black text-2xl'>{memoizedData?.last_name}</span>
			</div>
			<div className='info'>
				<span className='font-black text-2xl'>
					{locales[lang].user.Email}:{' '}
				</span>
				<span className='font-black text-2xl'>{memoizedData?.email}</span>
			</div>
			<div className='info'>
				<span className='font-black text-2xl'>
					{locales[lang].user.Category}:{' '}
				</span>
				<span className='font-black text-2xl'>{memoizedData?.category}</span>
			</div>
			<div className='info'>
				<span className='font-black text-2xl'>
					{locales[lang].user.WindowNumber}:{' '}
				</span>
				<span className='font-black text-2xl'>{memoizedData?.window}</span>
			</div>
			<div className='info'>
				<span className='font-black text-2xl'>
					{'rate'}:{' '}
				</span>
				<span className='font-black text-2xl'>{rate?.toFixed(2)}</span>
			</div>
		</div>
	)
}
