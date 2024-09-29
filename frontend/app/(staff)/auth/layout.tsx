import ReadOnlyChild from '@/types/readonly-child'
import Image from 'next/image'

export default function AuthLayout({ children }: ReadOnlyChild) {
	return (
		<div className='container mx-auto flex flex-col items-center pt-20'>
			<Image alt='' src={'/logo/narxoz.png'} width={400} height={161} />
			{ children }
		</div>
	)
}
