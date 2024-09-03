import Image from 'next/image'
import Wrapper from '../wrapper'

export default function Header() {
	return (
		<header className='top-0 left-0 right-0 flex justify-center select-none z-10 h-[75px]'>
			<Wrapper additionalStyles='bg-header-bg flex justify-center'>
				<Image alt='' src={'/narxoz.logo.svg'} width={121} height={50} />
			</Wrapper>
		</header>
	)
}
